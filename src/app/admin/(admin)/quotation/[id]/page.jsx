// components/admin/OrderDetailsPage.js
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
import { getQuotationById, adminUpdateQuotation, updateQuotationStatus } from "@/services/quotationOrderService";
import { getAllCoupons } from "@/services/couponService";
import dynamic from "next/dynamic";
import { toast } from "sonner";

const formatQuotationNumber = (num) => {
  if (!num) return "";
  const str = String(num);
  if (/^\d{7}$/.test(str)) {
    return `${str.slice(0, 2)}PI${str.slice(2)}`;
  }
  return str;
};

const QuotationPreviewAndPrint = dynamic(
  () => import("@/components/admin/QuotationPreviewAndPrint"),
  { ssr: false }
);

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
  const [calculatingIndex, setCalculatingIndex] = useState(null);
  const [appliedIndex, setAppliedIndex] = useState(null);

  const isModifiable = order?.status !== "cancelled";

  useEffect(() => {
    fetchOrder();
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const fetchOrder = async () => {
    try {
      const data = await getQuotationById(id);
      const coupondata = await getAllCoupons();
      setCoupons(coupondata.data.coupons);
      setOrder(data.quotation);
      setItems(data.quotation.items);
      setStatus(data.quotation.status);
      setTransportationCharge(data.quotation.transportationCharge || 0);
      const matchedCoupon = coupondata?.quotation?.coupons.find(
        (c) => c._id === data.quotation.coupon
        );
      setCouponCode(matchedCoupon?.code || "");
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
        customPrice: item.customPrice && item.customPrice > 0 ? Number(item.customPrice) : null,
      };
      if (item.product.pricingType === "length_width") payload.length = item.length || 1;
      if (item.product.pricingType === "area") {
        payload.length = item.length || 1;
        payload.width = item.width || 1;
      }
      const { data } = await calculatePrice(payload);
      return {
        ...item,
        unitPrice: data.finalDayPrice || data.discountPrice,
        finalPrice: data.finalPrice,
      };
    } catch {
      return item;
    }
  };

  const handleItemChange = async (index, field, value) => {
    setCalculatingIndex(index);
    const newItems = [...items];
    if (field === "withService") {
      newItems[index][field] = value === "true" || value === true;
    } else if (field === "customPrice") {
      newItems[index][field] = (value === "" || value === null) ? null : Number(value);
    } else {
      newItems[index][field] = Number(value);
    }
    setItems([...newItems]);
    const updated = await recalculateItemViaAPI(newItems[index]);
    newItems[index] = updated;
    setItems([...newItems]);
    setCalculatingIndex(null);

    if (field === "customPrice") {
      setAppliedIndex(index);
      setTimeout(() => setAppliedIndex(null), 2000);
      if (value && Number(value) > 0) {
        toast.success(`Offered price ₹${value} applied & recalculated!`);
      } else {
        toast.info("Custom price cleared. Standard rate restored.");
      }
    }
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

      const res = await adminUpdateQuotation(id, {
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
    try {
      await updateQuotationStatus(id, status);
      alert("Status updated successfully");
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Status update failed");
    }
  };

  const cancelOrder = async () => {
    try {
      await updateQuotationStatus(id, "cancelled");
      setStatus("cancelled");
      alert("Order cancelled");
    } catch (err) {
      console.error("Cancel failed", err);
    }
  };






  if (loading || !order) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 mt-12 md:mt-0 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="border-b pb-3">
          <CardTitle className="text-xl font-bold text-gray-900">
            Quotation #{formatQuotationNumber(order.quotationNumber) || order._id.slice(-6).toUpperCase()}
          </CardTitle>
          <p className="text-xs text-gray-500 font-mono mt-0.5">
            ID: <span className="select-all text-gray-700 font-medium">{order._id}</span>
          </p>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700 pt-4">

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
    <h2 className="text-lg font-semibold text-green-600 mb-2">💳 Quotation Summary</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                  ⚠️ This quotation has been cancelled and cannot be modified.
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
                <p className="text-sm text-muted-foreground">
                  {item.product?.pricingType}
                </p>

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
                {(() => {
                  const effectiveBaseRate = (item.customPrice && item.customPrice > 0) ? Number(item.customPrice) : (item.unitPrice || 0);
                  const displayUnitPrice = item.withService && item.product?.serviceChargePercent
                    ? parseFloat(Number(effectiveBaseRate * (1 + item.product.serviceChargePercent / 100)).toFixed(2))
                    : effectiveBaseRate;

                  return (
                    <div className="space-y-1">
                      <p className="text-sm flex items-center gap-2 flex-wrap">
                        <span><strong>Unit Price:</strong> ₹{displayUnitPrice}</span>
                        {item.customPrice && item.customPrice > 0 && (
                          <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                            Offered Price Active (Base: ₹{item.product?.discountPrice || item.product?.basePrice || item.unitPrice})
                          </span>
                        )}
                      </p>
                      {item.withService && item.product?.serviceChargePercent > 0 && (
                        <p className="text-xs text-amber-600 font-medium">
                          ({item.product.serviceChargePercent}% Service Included)
                        </p>
                      )}
                    </div>
                  );
                })()}

                  {/* Custom Price Input & Controls */}
                  <div className="space-y-2 pt-2 border-t mt-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-gray-700">Custom Offered Price (Per Base Unit):</p>
                      {item.customPrice && item.customPrice > 0 ? (
                        <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ✓ Offered Price Active
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-500 font-normal">
                          Standard rate active
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                        <Input
                          type="number"
                          value={item.customPrice ?? ""}
                          onChange={(e) => {
                            const val = e.target.value === "" ? null : Number(e.target.value);
                            const newItems = [...items];
                            newItems[index].customPrice = val;
                            setItems(newItems);
                          }}
                          onBlur={() => handleItemChange(index, "customPrice", item.customPrice)}
                          placeholder="Override base rate (optional)"
                          className="pl-7 text-sm"
                          disabled={!isModifiable}
                        />
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        variant={appliedIndex === index ? "default" : item.customPrice && item.customPrice > 0 ? "outline" : "default"}
                        className={
                          appliedIndex === index
                            ? "bg-emerald-600 text-white border-emerald-600 font-semibold animate-pulse"
                            : item.customPrice && item.customPrice > 0
                            ? "border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }
                        onClick={() => handleItemChange(index, "customPrice", item.customPrice)}
                        disabled={!isModifiable || calculatingIndex === index}
                      >
                        {calculatingIndex === index
                          ? "Applying..."
                          : appliedIndex === index
                          ? "✓ Rate Applied!"
                          : item.customPrice && item.customPrice > 0
                          ? "Re-apply Rate"
                          : "Apply Rate"}
                      </Button>

                      {item.customPrice && item.customPrice > 0 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50 text-xs px-2"
                          onClick={() => handleItemChange(index, "customPrice", null)}
                          disabled={!isModifiable}
                        >
                          Clear
                        </Button>
                      )}
                    </div>

                    {/* Rental formula explanation helper */}
                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 leading-relaxed flex items-center gap-1 flex-wrap">
                      {item.days > 1 ? (
                        <>
                          <span>ℹ️ <strong>Multi-day Rental ({item.days} Days):</strong></span>
                          {item.customPrice && item.customPrice > 0 ? (
                            <span>
                              Custom rate <strong>₹{item.customPrice}</strong> → <strong>₹{item.unitPrice}</strong>/unit for {item.days} days
                            </span>
                          ) : (
                            <span>
                              Base rate <strong>₹{item.product?.discountPrice || item.product?.basePrice}</strong> → <strong>₹{item.unitPrice}</strong>/unit for {item.days} days
                            </span>
                          )}
                          <span>
                            × <strong>{item.quantity || 1} units</strong> = <strong>₹{item.finalPrice}</strong>
                          </span>
                          {item.product?.dayWiseVariationPercent !== undefined && item.product?.dayWiseVariationPercent !== null && (
                            <span className="text-slate-500 font-medium ml-0.5">
                              (with {item.product.dayWiseVariationPercent}% day variation)
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <span>ℹ️ <strong>1-Day Rental:</strong></span>
                          {item.customPrice && item.customPrice > 0 ? (
                            <span>
                              Custom rate <strong>₹{item.customPrice}</strong>/unit
                            </span>
                          ) : (
                            <span>
                              Base rate <strong>₹{item.product?.discountPrice || item.product?.basePrice || item.unitPrice}</strong>/unit
                            </span>
                          )}
                          <span>
                            × <strong>{item.quantity || 1} units</strong> = <strong>₹{item.finalPrice}</strong>
                          </span>
                        </>
                      )}
                    </div>
                  </div>


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

        {/* Dynamic status transitions matching backend state-machine rules */}
        {(() => {
          const QUOTATION_TRANSITIONS = {
            pending: ["responded", "cancelled"],
            responded: ["cancelled"],
            cancelled: []
          };
          const currentStatus = order?.status;
          const allowedNext = QUOTATION_TRANSITIONS[currentStatus] || [];
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
              
              {hasTransitions && currentStatus !== "cancelled" && (
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
            <SelectValue placeholder={isModifiable ? "Select product to add" : "Quotation locked (cannot add products)"} />
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
      {/* {order.invoiceUrl && (
  <div className="flex gap-4 mt-4 mb-8">
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      onClick={() => window.open(order.invoiceUrl, "_blank")}
    >
      🧾 View Invoice
    </button>

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
      )} */}
      <QuotationPreviewAndPrint quotation={order} />
    </div>
  );
}
