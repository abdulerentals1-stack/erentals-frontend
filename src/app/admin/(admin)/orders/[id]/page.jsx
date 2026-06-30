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
import InvoicePreviewAndDownload from "@/components/admin/InvoicePreviewAndDownload";

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
      <p><strong>Price Before Tax:</strong> ₹{order?.priceBeforeTax?.toFixed(2) || "0.00"}</p>
      <p><strong>Discount:</strong> ₹{order?.discountAmount?.toFixed(2) || "0.00"}</p>
      <p><strong>Transportation:</strong> ₹{order?.transportationCharge?.toFixed(2) || "0.00"}</p>
      <p><strong>Labour:</strong> ₹{order?.labourCharge?.toFixed(2) || "0.00"}</p>
      <p><strong>SGST:</strong> ₹{order?.sgst?.toFixed(2) || "0.00"}</p>
      <p><strong>CGST:</strong> ₹{order?.cgst?.toFixed(2) || "0.00"}</p>
    </div>
    <p className="mt-3 text-lg font-bold text-indigo-700">
      Final Amount: ₹{order?.finalAmount?.toFixed(2) || "0.00"}
    </p>
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
      ₹{Math.max((order?.finalAmount || 0) - (order?.paidAmount || 0), 0).toFixed(2)}
    </span>
  </div>

</CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
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
                    />
                    <Input
                      type="number"
                      value={item.width}
                      onChange={(e) =>
                        handleItemChange(index, "width", e.target.value)
                      }
                      placeholder="Width"
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
                />

                <p className="text-sm text-muted-foreground">Quantity</p>
                <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    placeholder="Quantity"
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
                >
                  <SelectTrigger className="w-[200px]">
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
          />
        </div>
        <div>
          <label className="block mb-1">Coupon Code:</label>
          <Select
            value={couponCode || "__none__"}
            onValueChange={(val) =>
              setCouponCode(val === "__none__" ? '' : val)
            }
          >
            <SelectTrigger className="w-[300px]">
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

        <div className="flex gap-4 flex-wrap">
          <Button type="submit" disabled={!updateorder}>{updateorder ? "Update Order" : "Updating..."}</Button>
          <Select value={status} onValueChange={(val) => setStatus(val)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Change Status" />
            </SelectTrigger>
            <SelectContent>
              {[
                "placed",
                "confirmed",
                "shipped",
                "delivered",
                "returned",
                "cancelled",
              ].map((s) => (
                <SelectItem key={s} value={s}>
                  {s.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" variant="outline" onClick={handleStatusChange}>
            Update Status
          </Button>
          {status !== "cancelled" && status !== "returned" && (
            <Button type="button" variant="destructive" onClick={cancelOrder}>
              Cancel Order
            </Button>
          )}
        </div>
      </form>


      <div className="space-y-2 mt-6">
        <Input
          type="text"
          placeholder="Search product to add..."
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
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
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select product to add" />
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
      {order.invoiceUrl && (
  <div className="flex gap-4 mt-4 mb-8">
    {/* View Invoice Button */}
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      onClick={() => window.open(order.invoiceUrl, "_blank")}
    >
      🧾 View Invoice
    </button>

    {/* Download Invoice Button */}
    <button
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      onClick={() => {
        const link = document.createElement("a");
        link.href = order.invoiceUrl;
        link.download = `invoice-${order?._id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }}
    >
      ⬇️ Download Invoice
    </button>

    
  </div>
)}

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
                    <td className="p-3">
                      <details className="cursor-pointer text-xs">
                        <summary className="text-[10px] text-blue-600 hover:text-blue-800 font-medium">View Changes JSON</summary>
                        <pre className="mt-2 p-3 bg-gray-50 rounded text-[10px] text-zinc-800 font-mono overflow-auto max-w-xl max-h-[150px]">
                          {JSON.stringify(log.changes, null, 2)}
                        </pre>
                      </details>
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
