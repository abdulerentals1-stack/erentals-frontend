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
import { getAllProducts } from "@/services/productService";
import {
  getOrderById,
  adminUpdateOrder,
  updateOrderStatus,
} from "@/services/orderService";
import { getAllCoupons } from "@/services/couponService";

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

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === "withService" ? value : Number(value);
    setItems(newItems);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await adminUpdateOrder(id, {
        items,
        transportationCharge: Number(transportationCharge),
        couponCode: couponCode.trim() || null,
      });
      fetchOrder();
      alert("Order updated successfully");
    } catch (err) {
      console.error("Error updating order", err);
      alert("Failed to update order");
    }
  };

  const handleStatusChange = async () => {
    try {
      await updateOrderStatus(id, status);
      alert("Status updated successfully");
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Status update failed");
    }
  };

  const cancelOrder = async () => {
    try {
      await updateOrderStatus(id, "cancelled");
      setStatus("cancelled");
      alert("Order cancelled");
    } catch (err) {
      console.error("Cancel failed", err);
    }
  };

  if (loading || !order) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order #{order._id.slice(-6)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* 🧍 User Info */}
          <p>
            <strong>User Name:</strong> {order.user?.name}
          </p>
          <p>
            <strong>User Email:</strong> {order.user?.email}
          </p>

          {/* 📞 Address Info */}
          <p>
            <strong>Customer Name:</strong> {order.address?.name}
          </p>
          <p>
            <strong>Customer Mobile:</strong> {order.address?.phone}
          </p>
          <p>
            <strong>Address:</strong> {order.address?.addressLine},{" "}
            {order.address?.city}, {order.address?.state} -{" "}
            {order.address?.pincode}
          </p>
          <p>
            <strong>Address Type:</strong> {order.address?.type}
          </p>

          {/* 📦 Delivery Info */}
          <p>
            <strong>Delivery Date:</strong>{" "}
            {format(new Date(order.deliveryDate), "dd MMM yyyy")}
          </p>
          <p>
            <strong>Time Slot:</strong> {order.timeSlot}
          </p>
          <p>
            <strong>Total Items:</strong> {items.length}
          </p>

          {/* 💸 Payment Summary */}
          <p>
            <strong>Payment Method:</strong> {order.paymentMethod}
          </p>
          <p>
            <strong>Payment Status:</strong> {order.paymentStatus}
          </p>
          <p>
            <strong>Price Before Tax:</strong> ₹
            {order.priceBeforeTax?.toFixed(2)}
          </p>
          <p>
            <strong>Discount Price:</strong> ₹{order.discountAmount?.toFixed(2)}
          </p>
          <p>
            <strong>Transportation Charges:</strong> ₹
            {order.transportationCharge?.toFixed(2) || 0}
          </p>

          <p>
            <strong>SGST:</strong> ₹{order.sgst?.toFixed(2)}
          </p>
          <p>
            <strong>CGST:</strong> ₹{order.cgst?.toFixed(2)}
          </p>
          <p className="text-lg font-bold">
            <strong>Final Amount:</strong> ₹{order.finalAmount?.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {items.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>
                  {item.product.name}-{item.product.productCode}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {item.product.pricingType}
                </p>

                {/* Quantity / Length / Area Inputs */}
                {item.product.pricingType === "quantity" && (
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    placeholder="Quantity"
                  />
                )}
                {item.product.pricingType === "length_width" && (
                  <Input
                    type="number"
                    value={item.length}
                    onChange={(e) =>
                      handleItemChange(index, "length", e.target.value)
                    }
                    placeholder="Length"
                  />
                )}
                {item.product.pricingType === "area" && (
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
          <label className="block mb-1">Coupon Code:</label>
          <Select
            value={couponCode || "__none__"}
            onValueChange={(val) =>
              setCouponCode(val === "__none__" ? null : val)
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

        <div className="flex gap-4">
          <Button type="submit">Update Order</Button>
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
                "in_use",
                "pickup_scheduled",
                "picked_up",
                "cancelled",
                "returned",
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
          onValueChange={(productId) => {
            const selected = products.find((p) => p._id === productId);
            if (selected) {
              const newItem = {
                product: selected,
                pricingType: selected.pricingType,
                quantity: 1,
                length: 1,
                width: 1,
                days: 1,
                withService: false,
                finalPrice: 0,
              };
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
                  disabled={items.some((item) => item.product._id === p._id)}
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
        link.download = `invoice-${order._id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }}
    >
      ⬇️ Download Invoice
    </button>
  </div>
)}

    </div>
  );
}
