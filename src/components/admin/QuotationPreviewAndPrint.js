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
} from "@react-pdf/renderer";

export default function QuotationPreviewAndPrint({ quotation }) {
  const [open, setOpen] = useState(false);

  // fallback-safe destructuring
  const q = quotation || {};
  const items = q.items || [];
  const address = q.address || {};
  const user = q.user || {};

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-[#144169] text-white">
        🧾 Download Quotation
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl w-full h-[90vh]">
          <DialogHeader>
            <DialogTitle>Quotation Preview</DialogTitle>
          </DialogHeader>

          {/* PDF Preview */}
          <div className="w-full h-[65vh] border rounded-md overflow-hidden">
            <PDFViewer width="100%" height="100%">
              <QuotationPDF quotation={q} />
            </PDFViewer>
          </div>

          {/* Download Link */}
          <PDFDownloadLink
            document={<QuotationPDF quotation={q} />}
            fileName={`Quotation-${q?._id || "draft"}.pdf`}
          >
            {({ loading }) => (
              <Button className="bg-green-600 text-white mt-4 hover:bg-green-700">
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
        <Image
          src="https://res.cloudinary.com/danhxbweb/image/upload/v1760250366/erentals/products/a8ljrtm4eazwh1xp7osn.png"
          style={styles.headerImage}
        />

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
                <Text>{address.name || "N/A"}</Text>
                <Text>{address?.addressLine}, {address?.city}, {address?.state}, {address?.pincode}</Text>
                <Text>Phone: {address.phone || "N/A"}</Text>
                <Text>Email: {address.email || "N/A"}</Text>
                 {address?.gstin && <Text>GSTN: {address.gstin}</Text>}
              </View>
              <Text style={styles.dateText}>{createdAt}</Text>
            </View>

            <Text style={styles.desc}>
              As per your request to eRentals, we have successfully generated the quotation of the required items,
              please find the quotation and detail below. Delivery date is {deliveryDate}.
            </Text>
          </View>

          {/* Table */}
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>S.No</Text>
              <Text style={styles.tableCell}>Code</Text>
              <Text style={styles.tableCell}>Particulars</Text>
              <Text style={styles.tableCell}>Unit Rate</Text>
              <Text style={styles.tableCell}>Qty</Text>
              <Text style={styles.tableCell}>Days</Text>
              <Text style={styles.tableCell}>Total</Text>
            </View>

            {items.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tableCell}>{i + 1}</Text>
                <Text style={styles.tableCell}>{item.product?.productCode || "N/A"}</Text>
                <Text style={styles.tableCell}>{item.product?.name || "N/A"}</Text>
                <Text style={styles.tableCell}>{item.unitPrice || 0}</Text>
                <Text style={styles.tableCell}>{item.quantity || 0}</Text>
                <Text style={styles.tableCell}>{item.days || 0}</Text>
                <Text style={styles.tableCell}>{item.finalPrice || 0}</Text>
              </View>
            ))}

            {/* Totals */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 6 }]}>Sub Total</Text>
              <Text style={styles.tableCell}>{q.totalAmount || 0}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 6 }]}>Transportation</Text>
              <Text style={styles.tableCell}>{q.transportationCharge || 0}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 6 }]}>Labour Charges</Text>
              <Text style={styles.tableCell}>{q.labourCharge || 0}</Text>
            </View>
            {q.discountAmount > 0 && (
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 6 }]}>Discount</Text>
                  <Text style={styles.tableCell}>-{q.discountAmount}</Text>
                </View>
              )}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 6 }]}>Total Before Tax</Text>
              <Text style={styles.tableCell}>{q.priceBeforeTax || 0}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 6 }]}>GST @18%</Text>
              <Text style={styles.tableCell}>{(q.cgst || 0) + (q.sgst || 0)}</Text>
            </View>
            <View style={[styles.tableRow, styles.tableFooter]}>
              <Text style={[styles.tableCell, { flex: 6 }]}>Total Payable</Text>
              <Text style={styles.tableCell}>{q.finalAmount || 0}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 6 }]}>Advance @50%</Text>
              <Text style={styles.tableCell}>{Math.round((q.finalAmount || 0) / 2)}</Text>
            </View>
          </View>

          {/* Terms & Conditions */}
          <View style={styles.section}>
            <Text style={styles.termsTitle}>Terms & Conditions:</Text>
            {[
              "50% of the payment needs to be cleared for order confirmation and the rest of the payment at the time of delivery at your place including GST amount.",
              "If payment is to be made by cheque, 10% of the bill amount needs to be paid as advance for booking confirmation. The cheque is to be provided at the time of delivery of items.",
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
          src="https://res.cloudinary.com/dsc5aznps/image/upload/v1754374924/erentals/products/rznbkrrvd6f4yuwnj1tl.png"
          style={styles.footerImage}
        />
      </Page>
    </Document>
  );
};

// Styles
const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  headerImage: {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    height: 60,
  },
  footerImage: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 20,
  },
  contentWrapper: {
    paddingTop: 70,
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
  dateText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  desc: {
    marginTop: 0,
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
    borderColor: "#000",
    padding: 4,
  },
  tableHeader: {
    backgroundColor: "#002060",
    color: "#fff",
    fontWeight: "bold",
  },
  tableFooter: {
    backgroundColor: "#002060",
    color: "#fff",
  },
  termsTitle: {
    fontWeight: "bold",
    fontSize: 13,
    color: "tomato",
    marginBottom: 4,
  },
  termText: {
    marginLeft: 10,
    marginBottom: 3,
    fontSize: 10,
    lineHeight: 1.4,
  },
  subTermText: {
    marginLeft: 20,
    marginBottom: 2,
    fontSize: 10,
    lineHeight: 1.4,
    textAlign: "justify",
  },
  noteTitle: {
    fontWeight: "bold",
    fontSize: 13,
    color: "tomato",
    marginBottom: 4,
  },
  noteText: {
    fontSize: 10,
    color: "#000000",
    marginBottom: 2,
    lineHeight: 1.4,
  },
});
