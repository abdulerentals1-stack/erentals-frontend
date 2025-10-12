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
} from "@react-pdf/renderer";

export default function InvoicePreviewAndPrint({ order }) {
  const [open, setOpen] = useState(false);

  // Terms Array
  const terms = [
    "Customer will ensure quality and quantity of items at the time of delivery",
    "For the safety of the items, there is provision of refundable security deposit to be paid by customer in advance",
    "The refund amount will be credited back within 24 hours of return of items in sound conditions.",
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
      <Button onClick={() => setOpen(true)} className="bg-indigo-600 text-white">
        🧾 Preview & Download Invoice
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl w-full h-[90vh]">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
          </DialogHeader>

          <div className="w-full h-[65vh] border rounded-md overflow-hidden">
            <PDFViewer width="100%" height="100%">
              <InvoicePDF order={order} terms={terms} persons={personsInvolved} />
            </PDFViewer>
          </div>

          <PDFDownloadLink
            document={<InvoicePDF order={order} terms={terms} persons={personsInvolved} />}
            fileName={`Invoice-${order._id}.pdf`}
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Image with TAX INVOICE & Date */}
        <View style={{ position: "relative" }}>
          <Image
            src="https://res.cloudinary.com/danhxbweb/image/upload/v1760262056/erentals/products/cc5ocs3hdyqw76fhun0l.png"
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
              <Text>Shop No. 234, City Centre Mall, SV Road, Goregaon West, Mumbai, Maharashtra, 400104, India</Text>
              <Text>Phone: 9867348165 / 8652348165</Text>
              <Text>Email: info@erentals.in</Text>
              <Text>Website: www.erentals.in</Text>
              <Text>GSTN: 27AAGCE8977P1ZJ</Text>
              <Text>HSN/SAC: 998596</Text>
            </View>

            {/* Bill To */}
            <View style={styles.col}>
              <Text style={styles.title}>BILL TO</Text>
              <Text>{order.address?.name}</Text>
              <Text>{order.address?.addressLine}, {order.address?.city}, {order.address?.state}, {order.address?.pincode}</Text>
              <Text>{order.address?.phone}</Text>
              <Text>GSTN: {order.user?.gstId || "-"}</Text>
              <Text>Billing Date: {createdAt}</Text>
            </View>

            {/* Ship To */}
            <View style={styles.col}>
              <Text style={styles.title}>SHIP TO</Text>
              <Text>{order.address?.name}</Text>
              <Text>{order.address?.addressLine}, {order.address?.city}, {order.address?.state}, {order.address?.pincode}</Text>
              <Text>{order.address?.phone}</Text>
              <Text>Delivery Date: {deliveryDate}</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { width: "8%" }]}>S.No</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>Code</Text>
            <Text style={[styles.tableCell, { width: "40%" }]}>Particulars</Text>
            <Text style={[styles.tableCell, { width: "10%" }]}>Unit Rate</Text>
            <Text style={[styles.tableCell, { width: "8%" }]}>Qty</Text>
            <Text style={[styles.tableCell, { width: "10%" }]}>Days</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>Total</Text>
          </View>

          {order.items?.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "8%" }]}>{i + 1}</Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>{item.product?.productCode || "-"}</Text>
              <Text style={[styles.tableCell, { width: "40%" }]}>{item.product?.name}</Text>
              <Text style={[styles.tableCell, { width: "10%" }]}>{item.unitPrice}</Text>
              <Text style={[styles.tableCell, { width: "8%" }]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, { width: "10%" }]}>{item.rentalDays || 1}</Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>{item.finalPrice}</Text>
            </View>
          ))}

          {/* Totals */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "88%" }]}>Sub Total</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>{order.priceBeforeTax}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "88%" }]}>Transportation</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>{order.transportationCharge}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "88%" }]}>CGST @9%</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>{order.cgst}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "88%" }]}>SGST @9%</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>{order.sgst}</Text>
          </View>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { width: "88%" }]}>Total Payable</Text>
            <Text style={[styles.tableCell, { width: "12%" }]}>{order.finalAmount}</Text>
          </View>
        </View>
        {/* Terms & Conditions */}
        <View style={styles.section}>
          <Text style={styles.termsTitle}>Terms & Conditions:</Text>
          {terms.map((term, i) => {
            if (i === 4) {
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
        <View style={[styles.table, { marginTop: 10 }]}>
          <Text style={styles.termsTitle}>Check list of items:</Text>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { width: "8%" }]}>S.No</Text>
            <Text style={[styles.tableCell, { width: "40%" }]}>Particulars</Text>
            <Text style={[styles.tableCell, { width: "10%" }]}>Quantity</Text>
            <Text style={[styles.tableCell, { width: "14%" }]}>Warehouse</Text>
            <Text style={[styles.tableCell, { width: "14%" }]}>Customer Delivery</Text>
            <Text style={[styles.tableCell, { width: "14%" }]}>Customer Return</Text>
          </View>

          {order.items?.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "8%" }]}>{i + 1}</Text>
              <Text style={[styles.tableCell, { width: "40%" }]}>{item.product?.name}</Text>
              <Text style={[styles.tableCell, { width: "10%" }]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, { width: "14%" }]}>☐</Text>
              <Text style={[styles.tableCell, { width: "14%" }]}>☐</Text>
              <Text style={[styles.tableCell, { width: "14%" }]}>☐</Text>
            </View>
          ))}
        </View>

        {/* Persons Involved Table */}
        <View style={[styles.table, { marginTop: 10 }]}>
          <Text style={styles.termsTitle}>Persons involved in the deal:</Text>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { width: "25%" }]}>Person</Text>
            <Text style={[styles.tableCell, { width: "25%" }]}>Role</Text>
            <Text style={[styles.tableCell, { width: "25%" }]}>Signature</Text>
            <Text style={[styles.tableCell, { width: "25%" }]}>Remarks</Text>
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

        {/* Footer Image */}
        <Image
          src="https://res.cloudinary.com/dsc5aznps/image/upload/v1754374924/erentals/products/rznbkrrvd6f4yuwnj1tl.png"
          style={{ width: "100%", marginTop: 10 }}
        />
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 5,
    paddingHorizontal: 20,
    paddingVertical: 5,
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
    fontSize: 12,
    color: "tomato",
    marginBottom: 3,
  },
  table: {
    display: "table",
    width: "auto",
    paddingHorizontal:20,
    borderStyle: "solid",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    borderWidth: 0.5,
    borderColor: "#000",
    padding: 4,
    fontSize: 10,
  },
  tableHeader: {
    backgroundColor: "#002060",
    color: "#fff",
    fontWeight: "bold",
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
    fontSize: 12,
    color: "tomato",
    marginBottom: 3,
  },
  termText: {
    marginLeft: 10,
    marginBottom: 2,
    fontSize: 10,
  },
  subTermText: {
    marginLeft: 20,
    marginBottom: 2,
    fontSize: 10,
  },
  noteTitle: {
    fontWeight: "bold",
    fontSize: 12,
    color: "tomato",
    marginBottom: 3,
  },
  noteText: {
    fontSize: 10,
    marginBottom: 2,
    color: "#000",
  },
});
