"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { getAccessToken } from "@/lib/tokenManager";
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

const formatQuotationNumber = (num) => {
  if (!num) return "";
  const str = String(num);
  if (/^\d{7}$/.test(str)) {
    return `${str.slice(0, 2)}PI${str.slice(2)}`;
  }
  return str;
};

export default function QuotationPreviewAndPrint({ quotation, className, size = "default" }) {
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

  // fallback-safe destructuring
  const q = quotation || {};
  const activeSettings = settings || fallbackSettings;

  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    let activeUrl = null;
    if (open && q._id) {
      setPdfLoading(true);
      import("@react-pdf/renderer")
        .then(async (module) => {
          const pdfFn = module.pdf || module.default?.pdf;
          if (pdfFn) {
            const blob = await pdfFn(
              <QuotationPDF quotation={q} settings={activeSettings} />
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
  }, [open, q._id, settings]);

  return (
    <>
      <Button onClick={() => setOpen(true)} className={className || "bg-[#144169] text-white"} size={size}>
        🧾 Download Quotation
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col text-black">
          <DialogHeader>
            <DialogTitle>Quotation Preview</DialogTitle>
          </DialogHeader>

          {/* PDF Preview */}
          {pdfLoading ? (
            <div className="flex-1 w-full border rounded-lg flex items-center justify-center bg-gray-50 text-gray-500">
              Compiling quotation preview...
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="flex-1 w-full border rounded-lg"
              style={{ minHeight: "60vh" }}
              title="Quotation PDF"
            />
          ) : (
            <div className="flex-1 w-full border rounded-lg flex items-center justify-center bg-gray-50 text-gray-500">
              No quotation preview available.
            </div>
          )}

          {/* Download Link */}
          <Button
            onClick={() => {
              if (!pdfUrl) return;
              const link = document.createElement("a");
              link.href = pdfUrl;
              const quotationNumberDisplay = formatQuotationNumber(q.quotationNumber) || (q._id ? q._id.slice(-6).toUpperCase() : "DRAFT");
              link.download = `eRentals_Quotation_${quotationNumberDisplay}.pdf`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="bg-green-600 text-white mt-4 hover:bg-green-700 w-full"
            disabled={!pdfUrl || pdfLoading}
          >
            ⬇️ Download Quotation
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Quotation PDF Layout
const QuotationPDF = ({ quotation, settings }) => {
  const q = quotation || {};
  const items = q.items || [];
  const address = q.address || {};

  const createdAt = q.createdAt
    ? new Date(q.createdAt).toLocaleDateString()
    : "—";
  const deliveryDate = q.deliveryDate
    ? new Date(q.deliveryDate).toLocaleDateString()
    : "—";

  const totalAmount = Number(q.totalAmount || 0);
  const transportationCharge = Number(q.transportationCharge || 0);
  const labourCharge = Number(q.labourCharge || 0);
  const discountAmount = Number(q.discountAmount || 0);
  const priceBeforeTax = Number(q.priceBeforeTax !== undefined ? q.priceBeforeTax : (totalAmount - discountAmount));
  
  const gstRate = parseFloat(settings.GST_RATE || 18);
  const halfGst = gstRate / 2;
  const cgst = Number(q.cgst !== undefined ? q.cgst : (priceBeforeTax * (halfGst / 100)));
  const sgst = Number(q.sgst !== undefined ? q.sgst : (priceBeforeTax * (halfGst / 100)));
  const finalAmount = Number(q.finalAmount || (priceBeforeTax + cgst + sgst + transportationCharge + labourCharge));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Banner */}
        <View>
          <Image
            src="/Erental_Quotation_Header.png"
            style={styles.headerImage}
          />
        </View>

        {/* Quotation Metadata Row */}
        <View style={{ flexDirection: "column", alignItems: "flex-end", marginHorizontal: 20, marginBottom: 8, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: "#e2e8f0" }}>
          <Text style={{ fontSize: 10, fontWeight: "bold", color: "#144169", fontFamily: "Helvetica-Bold", marginBottom: 3 }}>
            PI/QUOTATION NO: {formatQuotationNumber(q.quotationNumber) || (q._id ? q._id.slice(-6).toUpperCase() : "DRAFT")}
          </Text>
          <Text style={{ fontSize: 9, fontWeight: "bold", color: "#475569" }}>
            Date: {createdAt}
          </Text>
        </View>

        {/* Customer / Date Info */}
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={{ width: "70%" }}>
              <Text style={styles.textBold}>To,</Text>
              <Text style={styles.bodyText}>{address.name || "N/A"}</Text>
              <Text style={styles.bodyText}>
                {address.addressLine || ""}, {address.city || ""}, {address.state || ""}, {address.pincode || ""}
              </Text>
              <Text style={styles.bodyText}>Phone: {address.phone || "N/A"}</Text>
              <Text style={styles.bodyText}>Email: {address.email || "N/A"}</Text>
              {address.gstin && (
                <Text style={styles.bodyText}>GSTN: {address.gstin}</Text>
              )}
            </View>
          </View>
          <Text style={styles.desc}>
            As per your request to eRentals, we have successfully generated the quotation of the required items, please find the quotation and detail below. Delivery date is {deliveryDate}.
          </Text>
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

          {items.map((item, i) => {
            let particulars = item.product?.name || "";
            let qtyDisplay = `${item.quantity || 0}`;

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
        </View>

        {/* Terms & Conditions */}
        <View style={styles.section}>
          <Text style={styles.termsTitle}>Terms & Conditions:</Text>
          {(() => {
            let activeTerms = [];
            try {
              const rawTerms = settings.QUOTATION_TERMS_AND_CONDITIONS || settings.TERMS_AND_CONDITIONS;
              if (rawTerms) {
                activeTerms = JSON.parse(rawTerms);
              }
            } catch (err) {
              console.error("Failed to parse terms from settings", err);
            }
            if (!activeTerms || activeTerms.length === 0) {
              activeTerms = [
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
              ];
            }
            return activeTerms.map((term, i) =>
              typeof term === "string" ? (
                <Text key={i} style={styles.termText}>{`${i + 1}. ${term}`}</Text>
              ) : (
                <View key={i} style={{ marginBottom: 3 }}>
                  <Text style={styles.termText}>{`${i + 1}. ${term.main}`}</Text>
                  {term?.sub?.map((subItem, j) => (
                    <Text key={j} style={styles.subTermText}>{`  ${j + 1}. ${subItem}`}</Text>
                  ))}
                </View>
              )
            );
          })()}
        </View>

        {/* Note / Bank Details */}
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
  textBold: {
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#475569",
  },
  desc: {
    marginTop: 5,
    fontSize: 9,
    color: "#475569",
    lineHeight: 1.3,
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
