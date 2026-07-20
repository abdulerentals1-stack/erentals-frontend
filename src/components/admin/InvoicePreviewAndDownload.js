"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { getAccessToken } from "@/lib/tokenManager";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Svg,
  Path,
  Circle,
} from "@react-pdf/renderer";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFViewer || m.default?.PDFViewer),
  { ssr: false }
);

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink || m.default?.PDFDownloadLink),
  { ssr: false }
);

// Reusable SVG Vector Icons for maximum PDF compatibility
const UserIcon = () => (
  <Svg width="9" height="9" viewBox="0 0 24 24" style={{ marginRight: 4, marginTop: 1.5 }}>
    <Path
      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
      stroke="#475569"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Circle
      cx="12"
      cy="7"
      r="4"
      stroke="#475569"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

const MapPinIcon = () => (
  <Svg width="9" height="9" viewBox="0 0 24 24" style={{ marginRight: 4, marginTop: 1.5 }}>
    <Path
      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
      stroke="#475569"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Circle
      cx="12"
      cy="10"
      r="3"
      stroke="#475569"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

const PhoneIcon = () => (
  <Svg width="9" height="9" viewBox="0 0 24 24" style={{ marginRight: 4, marginTop: 1.5 }}>
    <Path
      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      stroke="#475569"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

const MailIcon = () => (
  <Svg width="9" height="9" viewBox="0 0 24 24" style={{ marginRight: 4, marginTop: 1.5 }}>
    <Path
      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
      stroke="#475569"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M22 6l-10 7L2 6"
      stroke="#475569"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

const GlobeIcon = () => (
  <Svg width="9" height="9" viewBox="0 0 24 24" style={{ marginRight: 4, marginTop: 1.5 }}>
    <Circle
      cx="12"
      cy="12"
      r="10"
      stroke="#475569"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      stroke="#475569"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

const TaxIcon = () => (
  <Svg width="9" height="9" viewBox="0 0 24 24" style={{ marginRight: 4, marginTop: 1.5 }}>
    <Path
      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
      stroke="#475569"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
      stroke="#475569"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

const CalendarIcon = () => (
  <Svg width="9" height="9" viewBox="0 0 24 24" style={{ marginRight: 4, marginTop: 1.5 }}>
    <Path
      d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"
      stroke="#475569"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M16 2v4M8 2v4M3 10h18"
      stroke="#475569"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

const fallbackSettings = {
  COMPANY_NAME: "ERENTALS HND PVT LTD",
  COMPANY_ADDRESS: "G-304, 4th Floor, G Wing, Kailash Industrial Complex, Park site Rd, HMPL Surya Nagar, Vikhroli West, Mumbai, Maharashtra, Pin- 400079",
  COMPANY_PHONE: "9867348165 / 8652348165",
  COMPANY_EMAIL: "admin@e-rentals.in",
  COMPANY_WEBSITE: "www.e-rentals.in",
  COMPANY_GSTN: "27AAGCE8977P1ZJ",
  COMPANY_UDYAM: "UDYAM-MH-19-0133725",
  COMPANY_SAC: "998596",
  BANK_NAME: "IndusInd Bank",
  BANK_ACCOUNT_NAME: "ERENTALS HND PVT LTD",
  BANK_ACCOUNT_TYPE: "CURRENT",
  BANK_BRANCH: "Saki Naka",
  BANK_IFSC: "INDB0001075",
  BANK_ACCOUNT_NO: "259867348165"
};

export default function InvoicePreviewAndPrint({ order, className, size = "default" }) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    if (open) {
      api.get("/system-config/public")
        .then(res => {
          if (res.data?.success && res.data.data) {
            setSettings(res.data.data);
          }
        })
        .catch(err => {
          console.error("Failed to load company config:", err);
        });
    }
  }, [open]);

  // Terms Array
  const terms = [
    "100% of the payment needs to be cleared for order confirmation before delivery.",
    "If payment is to be made by cheque, booking is confirmed only after cheque clearance. The cheque must be cleared prior to delivery of items.",
    "Customer will ensure quality and quantity of items at the time of delivery.",
    "For the safety of the items, there is provision of refundable security deposit to be paid by customer in advance.",
    "The refund amount will be credited back within 24-48 hours of return of items in sound conditions.",
    "If there is any damage, a proportionate amount will be charged to the customers.",
    "There will be KYC completion of the customer by reviewing the following documents:",
    "Please be careful during delivery and pick of the items and mark accordingly.",
    "Any kind of dispute related to this invoice comes under the jurisdiction of Mumbai Court."
  ];

  // Persons Involved Array
  const personsInvolved = [
    { name: "Fatima Khatoon", role: "Manager" },
    { name: "Wasim (1000D)", role: "Delivery Person" },
    { name: "Hasnu (1000D)", role: "Person at Warehouse" },
  ];

  const activeSettings = settings || fallbackSettings;

  // Parse dynamic terms
  let activeTerms = terms;
  try {
    if (activeSettings.TERMS_AND_CONDITIONS) {
      activeTerms = JSON.parse(activeSettings.TERMS_AND_CONDITIONS);
    }
  } catch (err) {
    console.error("Failed to parse dynamic terms:", err);
  }

  // Parse dynamic persons
  let activePersons = personsInvolved;
  try {
    if (activeSettings.DEFAULT_PERSONS) {
      activePersons = JSON.parse(activeSettings.DEFAULT_PERSONS);
    }
  } catch (err) {
    console.error("Failed to parse dynamic persons:", err);
  }

  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    let activeUrl = null;
    if (open && order._id) {
      setPdfLoading(true);
      import("@react-pdf/renderer")
        .then(async (module) => {
          const pdfFn = module.pdf || module.default?.pdf;
          if (pdfFn) {
            const blob = await pdfFn(
              <InvoicePDF order={order} terms={activeTerms} persons={activePersons} settings={activeSettings} />
            ).toBlob();
            activeUrl = URL.createObjectURL(blob);
            setPdfUrl(activeUrl);
          }
          setPdfLoading(false);
        })
        .catch((err) => {
          console.error("Failed to generate client PDF blob:", err);
          setPdfLoading(false);
        });
    }
    return () => {
      if (activeUrl) {
        URL.revokeObjectURL(activeUrl);
      }
      setPdfUrl(null);
    };
  }, [open, order._id, settings]);

  return (
    <>
      <Button onClick={() => setOpen(true)} className={className || "bg-[#144169] text-white"} size={size}>
        {pdfUrl ? "📄 View & Download Invoice" : "⬇️ Download Invoice"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col text-black">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
          </DialogHeader>

          {/* PDF Preview */}
          {pdfLoading ? (
            <div className="flex-1 w-full border rounded-lg flex items-center justify-center bg-gray-50 text-gray-500">
              Compiling invoice preview...
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="flex-1 w-full border rounded-lg"
              style={{ minHeight: "60vh" }}
              title="Invoice PDF"
            />
          ) : (
            <div className="flex-1 w-full border rounded-lg flex items-center justify-center bg-gray-50 text-gray-500">
              No invoice preview available.
            </div>
          )}

          {/* Download Link */}
          <Button
            onClick={() => window.open(pdfUrl || "#", "_blank")}
            className="bg-green-600 text-white mt-4 hover:bg-green-700 w-full"
            disabled={!pdfUrl || pdfLoading}
          >
            ⬇️ Download Invoice
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

const InvoicePDF = ({ order, terms, persons, settings }) => {
  const createdAt = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—";
  const deliveryDate = order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "—";

  // Recalculate totalAmount as sum of items (avoids double-counting for old orders
  // where transportation/labour may have been incorrectly baked into totalAmount)
  const itemsSubTotal = (order.items || []).reduce(
    (sum, item) => sum + Number(item.finalPrice || 0), 0
  );
  // Use the recalculated items sum; fall back to stored totalAmount if no items
  const totalAmount = itemsSubTotal > 0 ? Math.round(itemsSubTotal * 100) / 100 : Number(order.totalAmount || 0);
  const transportationCharge = Number(order.transportationCharge || 0);
  const labourCharge = Number(order.labourCharge || 0);
  const discountAmount = Number(order.discountAmount || 0);
  const priceBeforeTax = Math.round((totalAmount - discountAmount + transportationCharge + labourCharge) * 100) / 100;
  
  const gstRate = parseFloat(settings.GST_RATE || 18);
  const halfGst = gstRate / 2;
  const cgst = Math.round(priceBeforeTax * (halfGst / 100) * 100) / 100;
  const sgst = Math.round(priceBeforeTax * (halfGst / 100) * 100) / 100;
  const finalAmount = Math.round((priceBeforeTax + cgst + sgst) * 100) / 100;
  const advancePaid = Number(order.advancePaid || 0);
  const paidAmount = Number(order.paidAmount || 0);
  const balanceDue = Math.max(0, Math.round((finalAmount - paidAmount) * 100) / 100);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Image with TAX INVOICE & Date */}
        <View style={{ position: "relative" }}>
          <Image
            src="/Erental_Invoice_Header.png"
            style={{ width: "100%", marginBottom: 10 }}
          />
          <View style={{
            position: "absolute",
            right: 25,
            top: 20,
            alignItems: "flex-end",
            justifyContent: "center",
          }}>
            <Text style={{ fontSize: 10, color: "#FFFFFF", fontWeight: "bold", fontFamily: "Helvetica-Bold" }}>
              TAX INVOICE: {order.orderNumber || order._id.slice(-6).toUpperCase()}
            </Text>
            <Text style={{ fontSize: 9, color: "#FFFFFF", marginTop: 3 }}>
              Date: {createdAt}
            </Text>
          </View>
        </View>

        {/* Company / Bill / Ship Info */}
        <View style={styles.section}>
          <View style={styles.row}>
            {/* Company */}
            <View style={styles.col}>
              <Text style={styles.title}>{settings.COMPANY_NAME}</Text>
              
              <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                <MapPinIcon />
                <Text style={[styles.bodyText, { flex: 1 }]}>{settings.COMPANY_ADDRESS}</Text>
              </View>
              
              <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                <PhoneIcon />
                <Text style={[styles.bodyText, { flex: 1 }]}>Phone: {settings.COMPANY_PHONE}</Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                <MailIcon />
                <Text style={[styles.bodyText, { flex: 1 }]}>Email: {settings.COMPANY_EMAIL}</Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                <GlobeIcon />
                <Text style={[styles.bodyText, { flex: 1 }]}>Website: {settings.COMPANY_WEBSITE}</Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                <TaxIcon />
                <Text style={[styles.bodyText, { flex: 1 }]}>GSTN: {settings.COMPANY_GSTN}</Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                <TaxIcon />
                <Text style={[styles.bodyText, { flex: 1 }]}>HSN/SAC: {settings.COMPANY_SAC}</Text>
              </View>

              {settings.COMPANY_UDYAM && (
                <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                  <TaxIcon />
                  <Text style={[styles.bodyText, { flex: 1 }]}>UDYAM: {settings.COMPANY_UDYAM}</Text>
                </View>
              )}
            </View>

            {/* Bill To */}
            <View style={styles.col}>
              <Text style={styles.title}>BILL TO</Text>
              
              <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                <UserIcon />
                <Text style={[styles.bodyText, { flex: 1 }]}>{order.address?.name}</Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                <MapPinIcon />
                <Text style={[styles.bodyText, { flex: 1 }]}>{order.address?.addressLine}, {order.address?.city}, {order.address?.state}, {order.address?.pincode}</Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                <PhoneIcon />
                <Text style={[styles.bodyText, { flex: 1 }]}>{order.address?.phone}</Text>
              </View>

              {order.address?.gstin && (
                <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                  <TaxIcon />
                  <Text style={[styles.bodyText, { flex: 1 }]}>GSTN: {order.address.gstin}</Text>
                </View>
              )}

              <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                <CalendarIcon />
                <Text style={[styles.bodyText, { flex: 1 }]}>Billing Date: {createdAt}</Text>
              </View>
            </View>

            {/* Ship To */}
            <View style={styles.col}>
              <Text style={styles.title}>SHIP TO</Text>
              
              <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                <UserIcon />
                <Text style={[styles.bodyText, { flex: 1 }]}>{order.address?.name}</Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                <MapPinIcon />
                <Text style={[styles.bodyText, { flex: 1 }]}>{order.address?.addressLine}, {order.address?.city}, {order.address?.state}, {order.address?.pincode}</Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                <PhoneIcon />
                <Text style={[styles.bodyText, { flex: 1 }]}>{order.address?.phone}</Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                <CalendarIcon />
                <Text style={[styles.bodyText, { flex: 1 }]}>Delivery Date: {deliveryDate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableHeaderCell, { width: "8%" }]}>S.No</Text>
            <Text style={[styles.tableHeaderCell, { width: "12%" }]}>Code</Text>
            <Text style={[styles.tableHeaderCell, { width: "40%" }]}>Particulars</Text>
            <Text style={[styles.tableHeaderCell, { width: "10%" }]}>Unit Rate</Text>
            <Text style={[styles.tableHeaderCell, { width: "8%" }]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, { width: "10%" }]}>Days</Text>
            <Text style={[styles.tableHeaderCell, { width: "12%" }]}>Total</Text>
          </View>

          {order.items?.map((item, i) => {
            let particulars = item.product?.name || "";
            let qtyDisplay = `${item.quantity || 0} pcs`;
            
            const baseRate = item.withService && item.product?.serviceChargePercent
              ? parseFloat(Number(item.unitPrice * (1 + item.product.serviceChargePercent / 100)).toFixed(2))
              : (item.unitPrice || 0);

            let displayRate = baseRate;

            if (item.pricingType === "area" && item.length > 0 && item.width > 0) {
              particulars += ` (${item.length}x${item.width} ft)`;
              displayRate = baseRate * item.length * item.width;
            } else if (item.pricingType === "length_width" && item.length > 0) {
              particulars += ` (${item.length} ft)`;
              displayRate = baseRate * item.length;
            }

            return (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: "8%" }]}>{i + 1}</Text>
                <Text style={[styles.tableCell, { width: "12%" }]}>{item.product?.productCode || "-"}</Text>
                <Text style={[styles.tableCell, { width: "40%" }]}>{particulars}</Text>
                <Text style={[styles.tableCell, { width: "10%" }]}>{displayRate.toFixed(2)}</Text>
                <Text style={[styles.tableCell, { width: "8%" }]}>{qtyDisplay}</Text>
                <Text style={[styles.tableCell, { width: "10%" }]}>{item.days || 1}</Text>
                <Text style={[styles.tableCell, { width: "12%" }]}>{parseFloat(item.finalPrice || 0).toFixed(2)}</Text>
              </View>
            );
          })}

          {/* Totals */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "88%" }]}>Sub Total</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>{totalAmount.toFixed(2)}</Text>
          </View>

          {discountAmount > 0 && (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "88%" }]}>Discount</Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>-{discountAmount.toFixed(2)}</Text>
            </View>
          )}

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "88%" }]}>Transportation</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>{transportationCharge.toFixed(2)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "88%" }]}>Labour Charges</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>{labourCharge.toFixed(2)}</Text>
          </View>

          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableHeaderCell, { width: "88%" }]}>Total payable before taxes</Text>
            <Text style={[styles.tableHeaderCell, { width: "12%" }]}>{priceBeforeTax.toFixed(2)}</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "88%" }]}>CGST @{halfGst}%</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>{cgst.toFixed(2)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "88%" }]}>SGST @{halfGst}%</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>{sgst.toFixed(2)}</Text>
          </View>

          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableHeaderCell, { width: "88%" }]}>Total Payable</Text>
            <Text style={[styles.tableHeaderCell, { width: "12%" }]}>{finalAmount.toFixed(2)}</Text>
          </View>
          {order?.paymentMethod !== "cod" && (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "88%" }]}>Advance Paid</Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>{advancePaid.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "88%" }]}>Total Paid</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>{paidAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "88%" }]}>Balance Due</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>{balanceDue.toFixed(2)}</Text>
          </View>
        </View>
        {/* Terms & Conditions */}
        <View style={styles.section}>
          <Text style={styles.termsTitle}>Terms & Conditions:</Text>
          {terms.map((term, i) => {
            if (i === 6) {
              return (
                <View key={i}>
                  <Text style={styles.termText}>{`${i + 1}. ${term}`}</Text>
                  <Text style={styles.subTermText}>a. Non-Business: Id and address proof in the same name and at the same (local) address.</Text>
                  <Text style={styles.subTermText}>b. Business: GST Certificate, visiting card and Company ID of the customer, Office address and manager level person contact.</Text>
                </View>
              );
            }
            return <Text key={i} style={styles.termText}>{`${i + 1}. ${term}`}</Text>;
          })}
        </View>

        {/* Checklist Table */}
        <View style={[styles.table, { marginTop: 10 }]} wrap={false}>
          <Text style={styles.termsTitle}>Check list of items:</Text>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableHeaderCell, { width: "8%" }]}>S.No</Text>
            <Text style={[styles.tableHeaderCell, { width: "40%" }]}>Particulars</Text>
            <Text style={[styles.tableHeaderCell, { width: "10%" }]}>Quantity</Text>
            <Text style={[styles.tableHeaderCell, { width: "14%" }]}>Warehouse</Text>
            <Text style={[styles.tableHeaderCell, { width: "14%" }]}>Customer Delivery</Text>
            <Text style={[styles.tableHeaderCell, { width: "14%" }]}>Customer Return</Text>
          </View>

          {order.items?.map((item, i) => {
            let qtyDisplay = item.quantity || 0;
            if (item.pricingType === "area" && item.length > 0 && item.width > 0) {
              qtyDisplay = `${item.length * item.width * item.quantity} sq.ft`;
            } else if (item.pricingType === "length_width" && item.length > 0) {
              qtyDisplay = `${item.length * item.quantity} ft`;
            } else {
              qtyDisplay = `${item.quantity} pcs`;
            }
            return (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: "8%" }]}>{i + 1}</Text>
                <Text style={[styles.tableCell, { width: "40%" }]}>{item.product?.name}</Text>
                <Text style={[styles.tableCell, { width: "10%" }]}>{qtyDisplay}</Text>
                <Text style={[styles.tableCell, { width: "14%" }]}>☐</Text>
                <Text style={[styles.tableCell, { width: "14%" }]}>☐</Text>
                <Text style={[styles.tableCell, { width: "14%" }]}>☐</Text>
              </View>
            );
          })}
        </View>

        {/* Persons Involved Table */}
        <View style={[styles.table, { marginTop: 10 }]} wrap={false}>
          <Text style={styles.termsTitle}>Persons involved in the deal:</Text>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableHeaderCell, { width: "25%" }]}>Person</Text>
            <Text style={[styles.tableHeaderCell, { width: "25%" }]}>Role</Text>
            <Text style={[styles.tableHeaderCell, { width: "25%" }]}>Signature</Text>
            <Text style={[styles.tableHeaderCell, { width: "25%" }]}>Remarks</Text>
          </View>
          {persons.map((p, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "25%" }]}>{p.name}</Text>
              <Text style={[styles.tableCell, { width: "25%" }]}>{p.role}</Text>
              <Text style={[styles.tableCell, { width: "25%" }]}></Text>
              <Text style={[styles.tableCell, { width: "25%" }]}></Text>
            </View>
          ))}
           <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "25%" }]}>{order?.address?.name}</Text>
              <Text style={[styles.tableCell, { width: "25%" }]}>Customer</Text>
              <Text style={[styles.tableCell, { width: "25%" }]}></Text>
              <Text style={[styles.tableCell, { width: "25%" }]}></Text>
            </View>

        </View>

        

        {/* Bank Note */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.noteTitle}>Note:</Text>
          {(() => {
            let accounts = [];
            try {
              if (settings.BANK_ACCOUNTS) {
                accounts = JSON.parse(settings.BANK_ACCOUNTS);
              }
            } catch (err) {
              console.error("Failed to parse bank accounts:", err);
            }
            
            if (!Array.isArray(accounts) || accounts.length === 0) {
              accounts = [{
                bankName: settings.BANK_NAME,
                accountName: settings.BANK_ACCOUNT_NAME,
                accountType: settings.BANK_ACCOUNT_TYPE,
                branchName: settings.BANK_BRANCH,
                ifscCode: settings.BANK_IFSC,
                accountNumber: settings.BANK_ACCOUNT_NO,
                upiId: settings.BANK_UPI
              }];
            }

            return accounts.map((acc, idx) => (
              <View key={idx} style={{ marginBottom: idx < accounts.length - 1 ? 6 : 0 }}>
                <Text style={styles.noteText}>Bank Details {accounts.length > 1 ? `#${idx + 1}` : ""}:</Text>
                <Text style={styles.noteText}>Bank Name: {acc.bankName || "—"}</Text>
                <Text style={styles.noteText}>Account Name: {acc.accountName || "—"}</Text>
                <Text style={styles.noteText}>Type of Account: {acc.accountType || "—"}</Text>
                <Text style={styles.noteText}>Branch Name: {acc.branchName || "—"}</Text>
                <Text style={styles.noteText}>IFSC Code: {acc.ifscCode || "—"}</Text>
                <Text style={styles.noteText}>Account No.: {acc.accountNumber || "—"}</Text>
                {acc.upiId && <Text style={styles.noteText}>UPI ID: {acc.upiId}</Text>}
              </View>
            ));
          })()}
        </View>

        {/* Footer Image */}
        <Image
          src="/Erental_Footer.png"
          style={{ width: "100%", marginTop: 10 }}
        />
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#334155",
  },
  section: {
    marginBottom: 4,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  col: {
    width: "32%",
  },
  title: {
    fontWeight: "bold",
    fontSize: 11,
    color: "tomato",
    marginBottom: 4,
  },
  bodyText: {
    color: "#475569",
    fontSize: 9,
    lineHeight: 1.25,
  },
  table: {
    display: "table",
    width: "auto",
    paddingHorizontal: 20,
    borderStyle: "solid",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    borderWidth: 0.5,
    borderColor: "#cbd5e1",
    padding: 5,
    fontSize: 9,
    color: "#334155",
  },
  tableHeaderCell: {
    borderWidth: 0.5,
    borderColor: "#002060",
    padding: 5,
    fontSize: 9,
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor: "#002060",
  },
  tableHeader: {
    backgroundColor: "#002060",
    color: "#fff",
    fontWeight: "bold",
    borderColor: "#002060",
  },
  headerTextContainer: {
    position: "absolute",
    top: 15,
    right: 25,
    alignItems: "flex-end",
  },
  invoiceNumber: {
    color: "white",
    fontWeight: "bold",
    fontSize: 10.5,
    marginBottom: 2,
    textAlign: "right",
  },
  invoiceDate: {
    color: "white",
    fontSize: 9,
    textAlign: "right",
  },
  termsTitle: {
    fontWeight: "bold",
    fontSize: 11,
    color: "tomato",
    marginBottom: 4,
  },
  termText: {
    marginLeft: 10,
    marginBottom: 2,
    fontSize: 9,
    color: "#475569",
  },
  subTermText: {
    marginLeft: 20,
    marginBottom: 2,
    fontSize: 8.5,
    color: "#64748b",
  },
  noteTitle: {
    fontWeight: "bold",
    fontSize: 11,
    color: "tomato",
    marginBottom: 4,
  },
  noteText: {
    fontSize: 9,
    marginBottom: 2,
    color: "#475569",
  },
});
