"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

export default function QuotationPreviewAndPrint({ quotation, className }) {
  const [open, setOpen] = useState(false);

  // fallback-safe destructuring
  const q = quotation || {};
  const items = q.items || [];
  const address = q.address || {};
  const user = q.user || {};

  return (
    <>
      <Button onClick={() => setOpen(true)} className={className || "bg-[#144169] text-white"}>
        🧾 Download Quotation
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Quotation Preview</DialogTitle>
          </DialogHeader>

          {/* PDF Preview */}
          <PDFViewer className="flex-1 w-full border rounded-lg">
            <QuotationPDF quotation={q} />
          </PDFViewer>

          {/* Download Link */}
          <PDFDownloadLink
            document={<QuotationPDF quotation={q} />}
            fileName={`Quotation-${q?._id || "draft"}.pdf`}
          >
            {({ loading }) => (
              <Button className="bg-green-600 text-white mt-4 hover:bg-green-700 w-full">
                {loading ? "Preparing PDF..." : "⬇️ Download Quotation"}
              </Button>
            )}
          </PDFDownloadLink>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Quotation PDF Layout
const QuotationPDF = ({ quotation }) => {
  const q = quotation || {};
  const items = q.items || [];
  const address = q.address || {};
  const user = q.user || {};

  const createdAt = q.createdAt
    ? new Date(q.createdAt).toLocaleDateString()
    : "—";
  const deliveryDate = q.deliveryDate
    ? new Date(q.deliveryDate).toLocaleDateString()
    : "—";

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>

        {/* Header Banner */}
        <View style={{ position: "relative" }}>
          <Image
            src="/Erental_Quotation_Header.png"
            style={styles.headerImage}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.invoiceNumber}>PI/QUOTATION NO: {q._id ? q._id.slice(-6).toUpperCase() : "DRAFT"}</Text>
            <Text style={styles.invoiceDate}>{createdAt}</Text>
          </View>
        </View>

        {/* Content Wrapper */}
        <View style={styles.contentWrapper}>
          <Text style={{ textAlign: "center", color: "#144169", fontSize: 18, marginBottom: 10 }}>
            Quotation
          </Text>

          {/* Header Info */}
          <View style={styles.section}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.textBold}>To,</Text>
                
                <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                  <UserIcon />
                  <Text style={[styles.bodyText, { flex: 1 }]}>{address.name || "N/A"}</Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                  <MapPinIcon />
                  <Text style={[styles.bodyText, { flex: 1 }]}>{address?.addressLine}, {address?.city}, {address?.state}, {address?.pincode}</Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                  <PhoneIcon />
                  <Text style={[styles.bodyText, { flex: 1 }]}>Phone: {address.phone || "N/A"}</Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                  <MailIcon />
                  <Text style={[styles.bodyText, { flex: 1 }]}>Email: {address.email || "N/A"}</Text>
                </View>

                {address?.gstin && (
                  <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 3 }}>
                    <TaxIcon />
                    <Text style={[styles.bodyText, { flex: 1 }]}>GSTN: {address.gstin}</Text>
                  </View>
                )}
              </View>

              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <CalendarIcon />
                <Text style={styles.dateText}>Date: {createdAt}</Text>
              </View>
            </View>

            <Text style={styles.desc}>
              As per your request to eRentals, we have successfully generated the quotation of the required items,
              please find the quotation and detail below. Delivery date is {deliveryDate}.
            </Text>
          </View>

          {/* Table */}
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

            {items.map((item, i) => {
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
                  <Text style={[styles.tableCell, { width: "12%" }]}>{item.product?.productCode || "N/A"}</Text>
                  <Text style={[styles.tableCell, { width: "40%" }]}>{particulars}</Text>
                  <Text style={[styles.tableCell, { width: "10%" }]}>{displayRate.toFixed(2)}</Text>
                  <Text style={[styles.tableCell, { width: "8%" }]}>{qtyDisplay}</Text>
                  <Text style={[styles.tableCell, { width: "10%" }]}>{item.days || 0}</Text>
                  <Text style={[styles.tableCell, { width: "12%" }]}>{item.finalPrice || 0}</Text>
                </View>
              );
            })}

            {/* Totals */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "88%" }]}>Sub Total</Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>{(q.totalAmount || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "88%" }]}>Transportation</Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>{(q.transportationCharge || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "88%" }]}>Labour Charges</Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>{(q.labourCharge || 0).toFixed(2)}</Text>
            </View>
            {q.discountAmount > 0 && (
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: "88%" }]}>Discount</Text>
                <Text style={[styles.tableCell, { width: "12%" }]}>-{Number(q.discountAmount).toFixed(2)}</Text>
              </View>
            )}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableHeaderCell, { width: "88%" }]}>Total Before Tax</Text>
              <Text style={[styles.tableHeaderCell, { width: "12%" }]}>{(q.priceBeforeTax || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "88%" }]}>GST @18%</Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>{((q.cgst || 0) + (q.sgst || 0)).toFixed(2)}</Text>
            </View>
            <View style={[styles.tableRow, styles.tableFooter]}>
              <Text style={[styles.tableHeaderCell, { width: "88%" }]}>Total Payable</Text>
              <Text style={[styles.tableHeaderCell, { width: "12%" }]}>{(q.finalAmount || 0).toFixed(2)}</Text>
            </View>
          </View>

          {/* Terms & Conditions */}
          <View style={styles.section}>
            <Text style={styles.termsTitle}>Terms & Conditions:</Text>
            {[
              "100% of the payment needs to be cleared for order confirmation before delivery.",
              "If payment is to be made by cheque, booking is confirmed only after cheque clearance. The cheque must be cleared prior to delivery of items.",
              "Customer will ensure quality and quantity of items at the time of delivery.",
              "For the safety of the items, there is provision of refundable security deposit to be paid by customer in advance.",
              "The refund amount will be credited back within 24-48 hours of return of items in sound conditions.",
              "If there is any damage, a proportionate amount will be charged to the customers.",
              "All legal disputes under Mumbai jurisdiction only.",
              {
                main: "If a confirmed order is cancelled due to some reasons, the paid amount will be refunded in the following ways:",
                sub: [
                  "If cancellation is 24 hours prior to the event, a 100% refund will be made.",
                  "If cancellation is 24–12 hours prior to the event, 50% refund will be done.",
                  "If cancellation is less than 12 hours prior to the event, 10% refund will be done.",
                ],
              },
              "GSTR1 shall not be filed unless we receive the payment.",
            ].map((term, i) =>
              typeof term === "string" ? (
                <Text key={i} style={styles.termText}>{`${i + 1}. ${term}`}</Text>
              ) : (
                <View key={i} style={{ marginBottom: 3 }}>
                  <Text style={styles.termText}>{`${i + 1}. ${term.main}`}</Text>
                  {term.sub.map((subItem, j) => (
                    <Text key={j} style={styles.subTermText}>{`${j + 1}. ${subItem}`}</Text>
                  ))}
                </View>
              )
            )}
          </View>

          {/* Note / Bank Details */}
          <View style={styles.section}>
            <Text style={styles.noteTitle}>Note:</Text>
            <Text style={styles.noteText}>Bank Details:</Text>
            <Text style={styles.noteText}>Bank Name: IndusInd Bank</Text>
            <Text style={styles.noteText}>Account Name: ERENTALS HND PVT LTD</Text>
            <Text style={styles.noteText}>Type of Account: CURRENT</Text>
            <Text style={styles.noteText}>Branch Name: Saki Naka</Text>
            <Text style={styles.noteText}>IFSC Code: INDB0001075</Text>
            <Text style={styles.noteText}>Account No.: 259867348165</Text>
          </View>
        </View>

        {/* Footer Banner */}
        <Image
          src="/Erental_Footer.png"
          style={styles.footerImage}
        />
      </Page>
    </Document>
  );
};

// Styles
const styles = StyleSheet.create({
  page: {
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#334155",
  },
  headerImage: {
    width: "100%",
    marginBottom: 10,
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
  footerImage: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 20,
  },
  contentWrapper: {
    paddingTop: 0,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 4,
    paddingVertical: 5,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textBold: {
    fontWeight: "bold",
  },
  bodyText: {
    color: "#475569",
    fontSize: 9,
    lineHeight: 1.25,
  },
  dateText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#475569",
  },
  desc: {
    marginTop: 5,
    fontSize: 9.5,
    color: "#334155",
    lineHeight: 1.3,
  },
  table: {
    display: "table",
    width: "auto",
    marginTop: 5,
    marginBottom: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: "#cbd5e1",
    padding: 5,
    fontSize: 9,
    color: "#334155",
  },
  tableHeaderCell: {
    flex: 1,
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
  tableFooter: {
    backgroundColor: "#002060",
    color: "#fff",
    borderColor: "#002060",
  },
  termsTitle: {
    fontWeight: "bold",
    fontSize: 11,
    color: "tomato",
    marginBottom: 4,
  },
  termText: {
    marginLeft: 10,
    marginBottom: 3,
    fontSize: 9,
    lineHeight: 1.4,
    color: "#475569",
  },
  subTermText: {
    marginLeft: 20,
    marginBottom: 2,
    fontSize: 8.5,
    lineHeight: 1.4,
    textAlign: "justify",
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
    color: "#475569",
    marginBottom: 2,
    lineHeight: 1.4,
  },
});
