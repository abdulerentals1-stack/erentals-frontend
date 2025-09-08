"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function QuotationPreviewAndPrint({ quotation }) {
  const [open, setOpen] = useState(false);
  const quoteRef = useRef();

  const handlePrint = () => {
    const content = quoteRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=700,width=900');
    printWindow.document.write('<html><head><title>Quotation</title></head><body>');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-indigo-600 text-white">
        🧽 Preview & Print Quotation
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl w-full overflow-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Quotation Preview</DialogTitle>
          </DialogHeader>

          <div ref={quoteRef} style={{ fontFamily: "Arial, sans-serif", fontSize: "12px" }}>
            <div className="Quotation-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
              <img src='https://res.cloudinary.com/dsc5aznps/image/upload/v1754374986/erentals/products/kppc40odan4gzngnfxsn.png' alt="banner" style={{ width: "100%", maxWidth: "1200px" }} />

              <div className="invoice-body" style={{ width: "100%", maxWidth: "1200px", marginTop: "20px" }}>
                <main>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <p><strong>To,</strong><br />
                        {quotation?.address?.name}<br />
                        Phone: {quotation?.address?.phone}<br />
                        Email: {quotation?.user?.email}
                      </p>
                    </div>
                    <p style={{ fontWeight: "bold", fontSize: "20px" }}>{new Date(quotation.createdAt).toLocaleDateString()}</p>
                  </div>

                  <p style={{ marginTop: "10px" }}>
                    As per your request to eRentals, we have generated the quotation for the required items.
                    Delivery date is {new Date(quotation.deliveryDate).toLocaleDateString()}.
                  </p>

                  <table style={{ margin: "20px 0", width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ backgroundColor: "#002060", color: "white", fontWeight: "bold" }}>
                      <tr>
                        <th style={cellStyle}>S.No</th>
                        <th style={cellStyle}>Code</th>
                        <th style={cellStyle}>Particulars</th>
                        <th style={cellStyle}>Unit Rate</th>
                        <th style={cellStyle}>Qty</th>
                        <th style={cellStyle}>Days</th>
                        <th style={cellStyle}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotation.items.map((item, i) => (
                        <tr key={i}>
                          <td style={cellStyle}>{i + 1}</td>
                          <td style={cellStyle}>{item.product?.productCode || "N/A"}</td>
                          <td style={cellStyle}>{item.product?.name || "N/A"}</td>
                          <td style={cellStyle}>₹{item.finalPrice}</td>
                          <td style={cellStyle}>{item.quantity}</td>
                          <td style={cellStyle}>{item.days}</td>
                          <td style={cellStyle}>₹{item.finalPrice}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="6" style={cellStyle}>Sub Total</td>
                        <td style={cellStyle}>₹{quotation.priceBeforeTax}</td>
                      </tr>
                      <tr>
                        <td colSpan="6" style={cellStyle}>Transportation</td>
                        <td style={cellStyle}>₹{quotation.transportationCharge}</td>
                      </tr>
                      <tr>
                        <td colSpan="6" style={cellStyle}>Total Before Tax</td>
                        <td style={cellStyle}>₹{quotation.totalAmount}</td>
                      </tr>
                      <tr>
                        <td colSpan="6" style={cellStyle}>GST @18%</td>
                        <td style={cellStyle}>₹{quotation.cgst + quotation.sgst}</td>
                      </tr>
                      <tr style={{ backgroundColor: "#002060", color: "white", fontWeight: "bold" }}>
                        <td colSpan="6" style={cellStyle}>Total Payable</td>
                        <td style={cellStyle}>₹{quotation.finalAmount}</td>
                      </tr>
                      <tr>
                        <td colSpan="6" style={cellStyle}>Advance @50%</td>
                        <td style={cellStyle}>₹{Math.round(quotation.finalAmount / 2)}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="terms-and-condition" style={{ marginTop: "10px" }}>
                    <h4 style={{ fontWeight: "bold" }}>Terms & Conditions:</h4>
                    <ol>
                      <li>50% payment required for confirmation; balance on delivery.</li>
                      <li>Cheque payments: 10% advance, cheque on delivery.</li>
                      <li>Customer must verify quantity/quality at delivery.</li>
                      <li>Refundable security deposit required.</li>
                      <li>Refund processed within 48hrs post return.</li>
                      <li>Damage charges apply if applicable.</li>
                      <li>Cancellation policy:
                        <ol>
                          <li>24+ hrs before: 100% refund</li>
                          <li>12-24 hrs before: 50% refund</li>
                          <li>&lt;12 hrs before: 10% refund</li>
                        </ol>
                      </li>
                    </ol>
                  </div>

                  <div className="note" style={{ marginTop: "10px" }}>
                    <h4 style={{ fontWeight: "bold" }}>Note:</h4>
                    <p>Bank: IndusInd Bank | A/C: ERENTALS HND PVT LTD | Current<br />IFSC: INDB0001075 | A/C No: 259867348165</p>
                  </div>

                  <p style={{ fontWeight: "bold", marginTop: "10px" }}>Thanks & Regards,<br />eRentals</p>
                </main>
              </div>

              <img src="https://res.cloudinary.com/dsc5aznps/image/upload/v1754374924/erentals/products/rznbkrrvd6f4yuwnj1tl.png" alt="footer" style={{ width: "100%", maxWidth: "1200px", marginTop: "20px" }} />
            </div>
          </div>

          <Button onClick={handlePrint} className="bg-green-600 text-white mt-4 hover:bg-green-700">
            🖨️ Print Quotation
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

const cellStyle = {
  border: "1px solid rgba(0,0,0,0.3)",
  padding: "8px",
  textAlign: "left",
};
