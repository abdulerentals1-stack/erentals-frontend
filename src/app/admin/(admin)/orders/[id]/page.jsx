// components/admin/OrderDetailsPage.js
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { getAllProducts, calculatePrice } from "@/services/productService";
import {
  getOrderById,
  adminUpdateOrder,
  updateOrderStatus,
  getOrderAuditLog,
} from "@/services/orderService";
import { getAllCoupons } from "@/services/couponService";
import dynamic from "next/dynamic";

const InvoicePreviewAndDownload = dynamic(
  () => import("@/components/admin/InvoicePreviewAndDownload"),
  { ssr: false }
);

const renderAuditChanges = (log) => {
  const changes = log.changes || {};
  const before = changes.before || {};
  const after = changes.after || {};

  const bulletPoints = [];

  // 1. Status change
  if (before.status !== after.status && after.status) {
    bulletPoints.push(
      `Status: "${before.status || 'N/A'}" ➔ "${after.status}"`
    );
  }

  // 2. Payment Status
  if (before.paymentStatus !== after.paymentStatus && after.paymentStatus) {
    bulletPoints.push(
      `Payment Status: "${before.paymentStatus || 'N/A'}" ➔ "${after.paymentStatus}"`
    );
  }

  // 3. Pricing details
  const pricingFields = [
    { key: "transportationCharge", label: "Transportation" },
    { key: "labourCharge", label: "Labour" },
    { key: "discountAmount", label: "Discount" },
    { key: "taxAmount", label: "GST Tax" },
    { key: "finalAmount", label: "Total Payable" },
  ];

  pricingFields.forEach(({ key, label }) => {
    const valBefore = before[key] !== undefined ? Number(before[key] || 0) : null;
    const valAfter = after[key] !== undefined ? Number(after[key] || 0) : null;
    if (valBefore !== null && valAfter !== null && valBefore !== valAfter) {
      bulletPoints.push(
        `${label}: ₹${valBefore.toFixed(2)} ➔ ₹${valAfter.toFixed(2)}`
      );
    }
  });

  // 4. Item differences
  if (before.items && after.items) {
    const beforeItems = before.items;
    const afterItems = after.items;

    if (beforeItems.length !== afterItems.length) {
      bulletPoints.push(
        `Items count: ${beforeItems.length} ➔ ${afterItems.length}`
      );
    } else {
      afterItems.forEach((item, idx) => {
        const prevItem = beforeItems[idx];
        if (prevItem) {
          const qtyBefore = prevItem.quantity;
          const qtyAfter = item.quantity;
          if (qtyBefore !== qtyAfter) {
            const prodName = item.product?.name || prevItem.product?.name || `Item #${idx + 1}`;
            bulletPoints.push(
              `"${prodName}" quantity: ${qtyBefore} ➔ ${qtyAfter}`
            );
          }
        }
      });
    }
  }

  if (bulletPoints.length === 0) {
    if (log.notes) {
      return <span className="text-gray-600">{log.notes}</span>;
    }
    return <span className="text-gray-400 font-mono text-[10px]">No field changes</span>;
  }

  return (
    <ul className="list-disc pl-4 space-y-1 text-gray-700">
      {bulletPoints.map((bp, i) => (
        <li key={i}>{bp}</li>
      ))}
    </ul>
  );
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("");
  const [transportationCharge, setTransportationCharge] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productSearch, setProductSearch] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [updateorder, setUpdateorder] = useState(true);
  const [auditLogs, setAuditLogs] = useState([]);
  const [verifyingGateway, setVerifyingGateway] = useState(false);
  const [gatewayVerifyResults, setGatewayVerifyResults] = useState(null);

  const isModifiable = ["placed", "pending_payment", "confirmed"].includes(order?.status);

  useEffect(() => {
    fetchOrder();
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const fetchOrder = async () => {
    try {
      const data = await getOrderById(id);
      const coupondata = await getAllCoupons();
      setCoupons(coupondata.data.coupons);
      setOrder(data.order);
      setItems(data.order.items);
      setStatus(data.order.status);
      setTransportationCharge(data.order.transportationCharge || 0);
      
      const matchedCoupon = coupondata.data.coupons.find(
        (c) => c._id === data.order.coupon
      );
      setCouponCode(matchedCoupon?.code || "");

      // Fetch audit logs
      try {
        const auditRes = await getOrderAuditLog(id);
        setAuditLogs(auditRes.logs || []);
      } catch (auditErr) {
        console.error("Failed to fetch audit logs", auditErr);
      }
    } catch (err) {
      console.error("Failed to fetch order", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.data.products);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };


  const recalculateItemViaAPI = async (item) => {
    if (!item.product?._id) return item;
    try {
      const payload = {
        productId: item.product._id,
        quantity: item.quantity || 1,
        days: item.days || 1,
        includeServiceCharge: item.withService || false,
      };
      if (item.product.pricingType === "length_width") payload.length = item.length || 1;
      if (item.product.pricingType === "area") {
        payload.length = item.length || 1;
        payload.width = item.width || 1;
      }
      const { data } = await calculatePrice(payload);
      return {
        ...item,
        unitPrice: data.discountPrice,
        finalPrice: data.finalPrice,
      };
    } catch {
      return item;
    }
  };

  const handleItemChange = async (index, field, value) => {
    const newItems = [...items];
    if (field === "withService") {
      newItems[index][field] = value;
    } else if (field === "customPrice") {
      newItems[index][field] = value === "" ? null : Number(value);
    } else {
      newItems[index][field] = Number(value);
    }
    setItems([...newItems]);
    const updated = await recalculateItemViaAPI(newItems[index]);
    newItems[index] = updated;
    setItems([...newItems]);
  };


  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    setUpdateorder(false)
    e.preventDefault();
    try {
      const payloadItems = items.map((item) => ({
        product: item.product?._id || item.product,
        pricingType: item.pricingType,
        quantity: item.quantity,
        length: item.length,
        width: item.width,
        days: item.days,
        withService: item.withService,
        customPrice: item.customPrice,
      }));

      const res = await adminUpdateOrder(id, {
        items: payloadItems,
        transportationCharge: Number(transportationCharge),
        labourCharge: Number(order.labourCharge || 0),
        couponCode: couponCode?.trim() || null,
      });
      fetchOrder();
      alert("Order updated successfully");
    } catch (err) {
      console.error("Error updating order", err);
      alert("Failed to update order");
    }finally{
      setUpdateorder(true)
    }
  };

  const handleStatusChange = async () => {
    const reason = prompt("Enter reason for changing status:");
    if (reason === null) return; // customer pressed cancel
    try {
      await updateOrderStatus(id, status, reason || "Admin updated status");
      alert("Status updated successfully");
      fetchOrder();
    } catch (err) {
      console.error("Failed to update status", err);
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  const cancelOrder = async () => {
    const reason = prompt("Enter reason for cancelling order:");
    if (reason === null) return; // customer pressed cancel
    try {
      await updateOrderStatus(id, "cancelled", reason || "Cancelled by admin");
      setStatus("cancelled");
      alert("Order cancelled successfully");
      fetchOrder();
    } catch (err) {
      console.error("Cancel failed", err);
      alert(err.response?.data?.message || "Cancellation failed");
    }
  };

  const handleVerifyGateway = async () => {
    if (verifyingGateway) return;
    setVerifyingGateway(true);
    try {
      const res = await axios.get(`/orders/${id}/verify-gateway`);
      setGatewayVerifyResults(res.data.results);
      if (res.data.recovered) {
        alert("Order recovery completed! Detected paid amount on Razorpay and updated order status to Placed.");
        fetchOrder();
      } else {
        alert("Verification complete. Razorpay states and local database are consistent.");
      }
    } catch (err) {
      console.error("Gateway verification failed:", err);
      alert("Verification query failed.");
    } finally {
      setVerifyingGateway(false);
    }
  };






  if (loading || !order) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 mt-12 md:mt-0 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order #{order._id.slice(-6)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700">

  {/* 👤 User Info */}
  <div className="border p-4 rounded-md shadow-sm bg-white">
    <h2 className="text-lg font-semibold text-indigo-600 mb-2">👤 User Information</h2>
    <p><strong>Name:</strong> {order?.user?.name || "N/A"}</p>
    <p><strong>Email:</strong> {order?.user?.email || "N/A"}</p>
  </div>

  {/* 🏠 Address Info */}
  <div className="border p-4 rounded-md shadow-sm bg-white">
    <h2 className="text-lg font-semibold text-blue-600 mb-2">📍 Delivery Address</h2>
    <p><strong>Customer Name:</strong> {order?.address?.name || "N/A"}</p>
    <p><strong>Mobile:</strong> {order?.address?.phone || "N/A"}</p>
    <p><strong>Email:</strong> {order?.address?.email || "N/A"}</p>
    {order?.address?.gstin && (
      <p><strong>GSTIN:</strong> {order.address.gstin}</p>
    )}
    <p>
      <strong>Address:</strong>{" "}
      {`${order?.address?.addressLine || ""}, ${order?.address?.city || ""}, ${order?.address?.state || ""} - ${order?.address?.pincode || ""}`}
    </p>
    <p><strong>Type:</strong> {order?.address?.type || "N/A"}</p>
  </div>

  {/* 📦 Delivery Info */}
  <div className="border p-4 rounded-md shadow-sm bg-white">
    <h2 className="text-lg font-semibold text-purple-600 mb-2">📦 Delivery Info</h2>
    <p>
      <strong>Delivery Date:</strong>{" "}
      {order?.deliveryDate ? format(new Date(order.deliveryDate), "dd MMM yyyy") : "N/A"}
    </p>
    <p><strong>Time Slot:</strong> {order?.timeSlot || "N/A"}</p>
    <p><strong>Total Items:</strong> {order?.items?.length || 0}</p>
  </div>

  {/* 💳 Payment Summary */}
  <div className="border p-4 rounded-md shadow-sm bg-white">
    <h2 className="text-lg font-semibold text-green-600 mb-2">💳 Payment Summary</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <p><strong>Method:</strong> {order?.paymentMethod || "N/A"}</p>
      <p><strong>Status:</strong>
        <span className={`ml-2 px-2 py-1 rounded text-xs font-medium capitalize ${
          order?.paymentStatus === "paid" ? "bg-green-100 text-green-800" :
          order?.paymentStatus === "partial" ? "bg-yellow-100 text-yellow-800" :
          order?.paymentStatus === "not_required" ? "bg-blue-100 text-blue-800" :
          "bg-red-100 text-red-800"
        }`}>
          {order?.paymentStatus === "not_required" ? "Pay on Delivery" : (order?.paymentStatus || "pending").replace(/_/g, ' ')}
        </span>
      </p>
      {(() => {
        const totalAmount = Number(order?.totalAmount || 0);
        const transportationCharge = Number(order?.transportationCharge || 0);
        const labourCharge = Number(order?.labourCharge || 0);
        const discountAmount = Number(order?.discountAmount || 0);
        
        const priceBeforeTax = totalAmount - discountAmount + transportationCharge + labourCharge;
        const halfGst = 9;
        const cgst = Math.round(priceBeforeTax * (halfGst / 100) * 100) / 100;
        const sgst = Math.round(priceBeforeTax * (halfGst / 100) * 100) / 100;
        const finalAmount = priceBeforeTax + cgst + sgst;

        return (
          <>
            <p><strong>Price Before Tax:</strong> ₹{priceBeforeTax.toFixed(2)}</p>
            <p><strong>Discount:</strong> ₹{discountAmount.toFixed(2)}</p>
            <p><strong>Transportation:</strong> ₹{transportationCharge.toFixed(2)}</p>
            <p><strong>Labour:</strong> ₹{labourCharge.toFixed(2)}</p>
            <p><strong>SGST:</strong> ₹{sgst.toFixed(2)}</p>
            <p><strong>CGST:</strong> ₹{cgst.toFixed(2)}</p>
            <p className="col-span-1 sm:col-span-2 mt-3 text-lg font-bold text-indigo-700">
              Final Amount: ₹{finalAmount.toFixed(2)}
            </p>
          </>
        );
      })()}
    </div>
    {order?.paymentMethod === "cod" && order?.paymentStatus !== "paid" && (
      <div className="mt-3 bg-blue-50 border border-blue-200 text-blue-800 rounded p-2.5 text-xs">
        💡 <strong>Cash on Delivery (COD):</strong> The customer can convert this to online payment and pay via their dashboard. Once paid, the status will automatically update to <strong>Paid (Razorpay)</strong>.
      </div>
    )}
  </div>

  {/* 🧾 Payment History */}
  <div className="border p-4 rounded-md shadow-sm bg-white">
    <h2 className="text-lg font-semibold text-pink-600 mb-2">🧾 Payment History</h2>
    {order?.paymentHistory?.length > 0 ? (
      <ul className="space-y-2">
        {order.paymentHistory.map((payment) => (
          <li key={payment?._id} className="flex justify-between items-start text-sm">
            <div>
              <p>
                ₹<strong>{payment?.amount}</strong> via{" "}
                <span className="capitalize">{payment?.method || "N/A"}</span>
              </p>
              <p className="text-gray-500 text-[10px] font-mono">
                Payment ID: {payment?.razorpay_payment_id || "N/A"}
              </p>
              <p className="text-gray-500 text-xs">
                {payment?.paidAt ? new Date(payment.paidAt).toLocaleString() : "Unknown Date"}
              </p>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              payment?.status === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-700"
            }`}>
              {payment?.status || "failed"}
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 text-sm">No payments made yet.</p>
    )}
  </div>

  {/* ⌛ Status History Timeline */}
  <div className="border p-4 rounded-md shadow-sm bg-white">
    <h2 className="text-lg font-semibold text-zinc-800 mb-2">⌛ Status History Timeline</h2>
    <div className="space-y-3 pl-2">
      {order?.statusHistory?.map((h, i) => (
        <div key={i} className="flex gap-3 text-xs">
          <div className="flex flex-col items-center">
            <div className="w-2 h-2 bg-zinc-600 rounded-full"></div>
            {i < order.statusHistory.length - 1 && <div className="w-0.5 h-full bg-zinc-200"></div>}
          </div>
          <div className="pb-1">
            <p className="font-semibold capitalize text-gray-800">
              {(h.from || "").replace(/_/g, ' ')} ➔ {(h.to || "").replace(/_/g, ' ')}
            </p>
            <p className="text-gray-500 text-[10px]">
              {new Date(h.timestamp).toLocaleString()} by {h.changedBy?.name || "System"} ({h.changedByRole})
            </p>
            <p className="text-gray-600 italic">"{h.reason}"</p>
          </div>
        </div>
      ))}
      {(!order?.statusHistory || order.statusHistory.length === 0) && (
        <p className="text-gray-500 text-xs">No status timeline available</p>
      )}
    </div>
  </div>

  {/* 🔗 Gateway Order IDs Verification */}
  {order?.paymentMethod === "razorpay" && (
    <div className="border p-4 rounded-md shadow-sm bg-white">
      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
        <h2 className="text-lg font-semibold text-teal-700">🔗 Razorpay Gateway Sync</h2>
        <Button 
          type="button" 
          size="sm" 
          onClick={handleVerifyGateway}
          disabled={verifyingGateway}
          className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded"
        >
          {verifyingGateway ? "Verifying..." : "Verify with Razorpay"}
        </Button>
      </div>
      
      {order?.razorpayOrderIds?.length > 0 ? (
        <div className="space-y-3">
          {order.razorpayOrderIds.map((item, idx) => (
            <div key={idx} className="bg-gray-50 p-2.5 rounded border text-xs flex justify-between items-start flex-wrap gap-2">
              <div>
                <p><strong>Razorpay Order ID:</strong> <span className="font-mono text-zinc-950 font-medium">{item.razorpayOrderId}</span></p>
                <p><strong>Type:</strong> <span className="capitalize">{item.type}</span> | <strong>Amount:</strong> ₹{item.amount}</p>
                <p><strong>Database Status:</strong> <span className="font-semibold uppercase text-zinc-700">{item.status}</span></p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-xs">No Razorpay orders generated for this order</p>
      )}

      {/* Gateway Verification Output */}
      {gatewayVerifyResults && (
        <div className="mt-4 bg-teal-50 border border-teal-200 p-3 rounded text-xs space-y-2 text-zinc-900">
          <h3 className="font-bold text-teal-800">Live Gateway Verification Results:</h3>
          {gatewayVerifyResults.map((res, i) => (
            <div key={i} className="border-b last:border-none pb-2 mb-2">
              <p><strong>RP Order:</strong> {res.razorpayOrderId}</p>
              <p><strong>Gateway Order Status:</strong> <span className="font-semibold uppercase text-indigo-700">{res.gatewayStatus}</span></p>
              <p><strong>In Sync?</strong> {res.match ? "✅ Yes" : "❌ Discrepancy Found!"}</p>
              {res.payments && res.payments.length > 0 ? (
                <div className="mt-1 pl-2 border-l-2 border-teal-300">
                  <p className="font-semibold text-gray-600">Gateway Payments:</p>
                  {res.payments.map((p, pi) => (
                    <p key={pi} className="text-[10px]">
                      • {p.id} - ₹{p.amount} - <span className="capitalize">{p.status}</span> ({p.method})
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-gray-500 mt-1">• No payments registered on Razorpay for this order ID</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )}

  {/* 💰 Remaining Amount */}
  <div className="flex justify-between items-center p-4 bg-yellow-50 border rounded-md shadow-inner">
    <span className="font-medium text-gray-700 text-sm">🧮 Remaining Amount</span>
    <span className="text-lg font-semibold text-red-600">
      ₹{(order?.status === "cancelled" ? 0 : Math.max((order?.finalAmount || 0) - (order?.paidAmount || 0), 0)).toFixed(2)}
    </span>
  </div>

</CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isModifiable && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md text-black">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700 font-medium">
                  ⚠️ This order cannot be modified in its current status ({order?.status}). Charges and items are locked.
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="space-y-4">
          {items.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>
                  {item.product?.name}-{item.product?.productCode}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* <p className="text-sm text-muted-foreground">
                  {item.product?.pricingType}
                </p> */}

                {/* Quantity / Length / Area Inputs */}

                {item.product?.pricingType === "length_width" && (
                  <Input
                    type="number"
                    value={item.length}
                    onChange={(e) =>
                      handleItemChange(index, "length", e.target.value)
                    }
                    placeholder="Length"
                    disabled={!isModifiable}
                  />
                )}
                {item.product?.pricingType === "area" && (
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={item.length}
                      onChange={(e) =>
                        handleItemChange(index, "length", e.target.value)
                      }
                      placeholder="Length"
                      disabled={!isModifiable}
                    />
                    <Input
                      type="number"
                      value={item.width}
                      onChange={(e) =>
                        handleItemChange(index, "width", e.target.value)
                      }
                      placeholder="Width"
                      disabled={!isModifiable}
                    />
                  </div>
                )}

                {/* Days Input */}
                <p className="text-sm text-muted-foreground">Days</p>
                <Input
                  type="number"
                  value={item.days}
                  onChange={(e) =>
                    handleItemChange(index, "days", e.target.value)
                  }
                  placeholder="Days"
                  disabled={!isModifiable}
                />

                <p className="text-sm text-muted-foreground">Quantity</p>
                <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    placeholder="Quantity"
                    disabled={!isModifiable}
                  />

                {/* ✅ Service Charge Toggle */}
                <p className="text-sm text-muted-foreground">
                  Include Service?
                </p>
                <Select
                  value={item.withService ? "true" : "false"}
                  onValueChange={(val) =>
                    handleItemChange(index, "withService", val === "true")
                  }
                  disabled={!isModifiable}
                >
                  <SelectTrigger className="w-[200px] text-black bg-white">
                    <SelectValue placeholder="Include Service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>

                {/* Unit Price Display */}
                  <p className="text-sm">
                    <strong>Unit Price:</strong> ₹
                    {item.withService && item.product?.serviceChargePercent
                      ? parseFloat(Number(item.unitPrice * (1 + item.product.serviceChargePercent / 100)).toFixed(2))
                      : item.unitPrice || 0}
                    {item.withService && item.product?.serviceChargePercent > 0 && (
                      <span className="text-xs text-amber-600 font-medium ml-1.5">
                        ({item.product.serviceChargePercent}% Service Included)
                      </span>
                    )}
                  </p>

                  {/* Custom Price Input */}
                  <p className="text-sm text-muted-foreground">Custom Price (per unit):</p>
                  <Input
                    type="number"
                    value={item.customPrice ?? ""}
                    onChange={(e) => handleItemChange(index, "customPrice", e.target.value || null)}
                    placeholder="Custom Price (optional)"
                    disabled={!isModifiable}
                  />


                {/* Final Price + Remove */}
                <div className="flex justify-between items-center">
                  <p>
                    <strong>Final Price:</strong> ₹{item.finalPrice}
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem(index)}
                    disabled={!isModifiable}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <label>Transportation Charge:</label>
          <Input
            type="number"
            value={transportationCharge}
            onChange={(e) => setTransportationCharge(e.target.value)}
            disabled={!isModifiable}
          />
        </div>
        <div>
          <label>Labour Charge:</label>
          <Input
            type="number"
            value={order.labourCharge || 0}
            onChange={(e) =>
              setOrder((prev) => ({
                ...prev,
                labourCharge: Number(e.target.value),
              }))
            }
            disabled={!isModifiable}
          />
        </div>
        <div>
          <label className="block mb-1">Coupon Code:</label>
          <Select
            value={couponCode || "__none__"}
            onValueChange={(val) =>
              setCouponCode(val === "__none__" ? '' : val)
            }
            disabled={!isModifiable}
          >
            <SelectTrigger className="w-[300px] text-black bg-white">
              <SelectValue placeholder="Select coupon or remove" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">❌ Remove Coupon</SelectItem>
              {coupons.map((coupon) => (
                <SelectItem key={coupon.code} value={coupon.code}>
                  {coupon.code} -{" "}
                  {coupon.discountType === "flat"
                    ? `₹${coupon.discountValue} off`
                    : `${coupon.discountValue}% off`}
                  {coupon.maxDiscount ? ` (Max ₹${coupon.maxDiscount})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dynamic status list computation */}
        {(() => {
          const ORDER_TRANSITIONS = {
            pending_payment: ["placed", "cancelled"],
            placed: ["confirmed", "cancelled"],
            confirmed: ["delivered", "cancelled"],
            delivered: ["returned"],
            returned: [],
            cancelled: []
          };
          const currentStatus = order?.status;
          const allowedNext = ORDER_TRANSITIONS[currentStatus] || [];
          const statusOptions = Array.from(new Set([currentStatus, ...allowedNext])).filter(Boolean);
          const hasTransitions = allowedNext.length > 0;

          return (
            <div className="flex gap-4 flex-wrap mt-4 items-center">
              <Button type="submit" disabled={!isModifiable || !updateorder}>
                {updateorder ? "Update Order" : "Updating..."}
              </Button>
              
              <Select 
                value={status} 
                onValueChange={(val) => setStatus(val)}
                disabled={!hasTransitions}
              >
                <SelectTrigger className="w-[200px] text-black bg-white">
                  <SelectValue placeholder="Change Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s} className="text-black bg-white">
                      {s.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleStatusChange}
                disabled={!hasTransitions}
              >
                Update Status
              </Button>
              
              {hasTransitions && currentStatus !== "cancelled" && currentStatus !== "returned" && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={cancelOrder}
                >
                  Cancel Order
                </Button>
              )}
            </div>
          );
        })()}
      </form>


      <div className="space-y-2 mt-6">
        <Input
          type="text"
          placeholder="Search product to add..."
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
          disabled={!isModifiable}
        />
        <Select
          onValueChange={async (productId) => {
            const selected = products.find((p) => p?._id === productId);
            if (selected) {
              let newItem = {
                product: selected,
                pricingType: selected.pricingType,
                quantity: 1,
                length: 1,
                width: 1,
                days: 1,
                withService: false,
                finalPrice: 0,
              };
              newItem = await recalculateItemViaAPI(newItem);
              setItems((prev) => [...prev, newItem]);
            }
          }}
          disabled={!isModifiable}
        >
          <SelectTrigger className="w-full text-black bg-white">
            <SelectValue placeholder={isModifiable ? "Select product to add" : "Order locked (cannot add products)"} />
          </SelectTrigger>
          <SelectContent>
            {filteredProducts.length ? (
              filteredProducts.map((p) => (
                <SelectItem
                  key={p._id}
                  value={p._id}
                  disabled={
                      p.pricingType === "quantity" &&
                      items.some((item) => item.product?._id === p._id)
                    }
                   >
                  <div className="flex items-center gap-2">
                    <img
                      src={p.images?.[0]?.url}
                      alt={p.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                    {p.name}
                  </div>
                </SelectItem>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-muted-foreground">
                No products found
              </div>
            )}
          </SelectContent>
        </Select>
      </div>


<InvoicePreviewAndDownload order={order} />

      {/* 📋 System Audit Trail */}
      <Card className="mt-8 text-black bg-white shadow-sm border border-zinc-200">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            📋 System Audit Trail
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto text-xs">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-gray-600 font-semibold">
                <tr>
                  <th className="p-3 text-left">Action</th>
                  <th className="p-3 text-left">Performed By</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Changes</th>
                  <th className="p-3 text-left">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-800">
                {auditLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="p-3 font-mono font-medium text-indigo-700">{log.action}</td>
                    <td className="p-3">{log.performedBy?.name || "System"}</td>
                    <td className="p-3 capitalize">{log.performedByRole}</td>
                    <td className="p-3 text-xs text-zinc-700">
                      {renderAuditChanges(log)}
                    </td>
                    <td className="p-3 text-gray-500">{new Date(log.createdAt).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
                {auditLogs.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No system audit logs recorded for this order.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
