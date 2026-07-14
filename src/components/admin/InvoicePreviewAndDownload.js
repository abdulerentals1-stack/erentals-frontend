"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
  PDFDownloadLink,
  Svg,
  Path,
  Circle,
} from "@react-pdf/renderer";

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

export default function InvoicePreviewAndPrint({ order, className }) {
  const [open, setOpen] = useState(false);

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

  return (
    <>
      <Button onClick={() => setOpen(true)} className={className || "bg-[#144169] text-white"}>
        {order.invoiceUrl && ["confirmed", "placed", "delivered"].includes(order.status)
          ? "📄 View & Download Invoice"
          : "⬇️ Download Invoice"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
          </DialogHeader>

          <PDFViewer className="flex-1 w-full border rounded-lg">
            <InvoicePDF order={order} terms={terms} persons={personsInvolved} />
          </PDFViewer>

          <PDFDownloadLink
            document={<InvoicePDF order={order} terms={terms} persons={personsInvolved} />}
            fileName={`Invoice-${order._id.slice(-6)}.pdf`}
          >
            {({ loading }) => (
              <Button className="bg-green-600 text-white mt-4 hover:bg-green-700">
                {loading ? "Preparing PDF..." : "⬇️ Download Invoice"}
              </Button>
            )}
          </PDFDownloadLink>
        </DialogContent>
      </Dialog>
    </>
  );
}

const InvoicePDF = ({ order, terms, persons }) => {
  const createdAt = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—";
  const deliveryDate = order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "—";

  const totalAmount = Number(order.totalAmount || 0);
  const transportationCharge = Number(order.transportationCharge || 0);
  const labourCharge = Number(order.labourCharge || 0);
  const discountAmount = Number(order.discountAmount || 0);
  const priceBeforeTax = Number(order.priceBeforeTax || (totalAmount + transportationCharge + labourCharge - discountAmount));
  const cgst = Number(order.cgst || (priceBeforeTax * 0.09));
  const sgst = Number(order.sgst || (priceBeforeTax * 0.09));
  const finalAmount = Number(order.finalAmount || (priceBeforeTax + cgst + sgst));
  const advancePaid = Number(order.advancePaid || 0);
  const paidAmount = Number(order.paidAmount || 0);
  const balanceDue = Math.max(0, finalAmount - paidAmount);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Image with TAX INVOICE & Date */}
        <View style={{ position: "relative" }}>
          <Image
            src="/Erental_Invoice_Header.png"
            style={{ width: "100%", marginBottom: 10 }}
          />
          <Text style={styles.invoiceNumber}>TAX INVOICE: {order._id.slice(-6)}</Text>
          <Text style={styles.invoiceDate}>{deliveryDate}</Text>
        </View>

        {/* Company / Bill / Ship Info */}
        <View style={styles.section}>
          <View style={styles.row}>
            {/* Company */}
            <View style={styles.col}>
              <Text style={styles.title}>ERENTALS HND PVT LTD</Text>
              
              <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                <MapPinIcon />
                <Text style={[styles.bodyText, { flex: 1 }]}>Shop No. 234, City Centre Mall, SV Road, Goregaon West, Mumbai, Maharashtra, 400104, India</Text>
              </View>
              
              <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                <PhoneIcon />
                <Text style={[styles.bodyText, { flex: 1 }]}>Phone: 9867348165 / 8652348165</Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                <MailIcon />
                <Text style={[styles.bodyText, { flex: 1 }]}>Email: info@erentals.in</Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                <GlobeIcon />
                <Text style={[styles.bodyText, { flex: 1 }]}>Website: www.erentals.in</Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                <TaxIcon />
                <Text style={[styles.bodyText, { flex: 1 }]}>GSTN: 27AAGCE8977P1ZJ</Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                <TaxIcon />
                <Text style={[styles.bodyText, { flex: 1 }]}>HSN/SAC: 998596</Text>
              </View>
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
            let qtyDisplay = item.quantity || 0;

            if (item.pricingType === "area" && item.length > 0 && item.width > 0) {
              particulars += ` (${item.length}x${item.width} ft)`;
              qtyDisplay = `${item.length * item.width * item.quantity} sq.ft`;
            } else if (item.pricingType === "length_width" && item.length > 0) {
              particulars += ` (${item.length} ft)`;
              qtyDisplay = `${item.length * item.quantity} ft`;
            } else {
              qtyDisplay = `${item.quantity} pcs`;
            }

            const unitRate = item.withService && item.product?.serviceChargePercent
              ? parseFloat(Number(item.unitPrice * (1 + item.product.serviceChargePercent / 100)).toFixed(2))
              : (item.unitPrice || 0);

            return (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: "8%" }]}>{i + 1}</Text>
                <Text style={[styles.tableCell, { width: "12%" }]}>{item.product?.productCode || "-"}</Text>
                <Text style={[styles.tableCell, { width: "40%" }]}>{particulars}</Text>
                <Text style={[styles.tableCell, { width: "10%" }]}>{unitRate}</Text>
                <Text style={[styles.tableCell, { width: "8%" }]}>{qtyDisplay}</Text>
                <Text style={[styles.tableCell, { width: "10%" }]}>{item.rentalDays || 1}</Text>
                <Text style={[styles.tableCell, { width: "12%" }]}>{item.finalPrice}</Text>
              </View>
            );
          })}

          {/* Totals */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "88%" }]}>Sub Total</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>{totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "88%" }]}>Transportation</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>{transportationCharge.toFixed(2)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "88%" }]}>Labour Charges</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>{labourCharge.toFixed(2)}</Text>
          </View>

          {discountAmount > 0 && (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "88%" }]}>Discount</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>-{discountAmount.toFixed(2)}</Text>
          </View>
           )}

          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableHeaderCell, { width: "88%" }]}>Total payable before taxes</Text>
            <Text style={[styles.tableHeaderCell, { width: "12%" }]}>{priceBeforeTax.toFixed(2)}</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "88%" }]}>CGST @9%</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>{cgst.toFixed(2)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "88%" }]}>SGST @9%</Text>
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
          <Text style={styles.noteText}>Bank Details:</Text>
          <Text style={styles.noteText}>Bank Name: IndusInd Bank</Text>
          <Text style={styles.noteText}>Account Name: ERENTALS HND PVT LTD</Text>
          <Text style={styles.noteText}>Type of Account: CURRENT</Text>
          <Text style={styles.noteText}>Branch Name: Saki Naka</Text>
          <Text style={styles.noteText}>IFSC Code: INDB0001075</Text>
          <Text style={styles.noteText}>Account No.: 259867348165</Text>
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
  invoiceNumber: {
    position: "absolute",
    top: 20,
    right: 40,
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  invoiceDate: {
    position: "absolute",
    top: 40,
    right: 40,
    color: "white",
    fontSize: 10,
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
