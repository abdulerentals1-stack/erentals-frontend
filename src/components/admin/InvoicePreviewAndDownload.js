"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function InvoicePreviewAndPrint({ order }) {
  const [open, setOpen] = useState(false);
  const invoiceRef = useRef();

  const handlePrint = () => {
    const content = invoiceRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=700,width=900');
    printWindow.document.write('<html><head><title>Invoice</title></head><body>');
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
        🧾 Preview & Print Invoice
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl w-full overflow-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
          </DialogHeader>

          {/* Invoice */}
          <div ref={invoiceRef}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              <img
                src="https://res.cloudinary.com/dsc5aznps/image/upload/v1754374958/erentals/products/irhbobxqzi3gydzy8izg.png"
                alt="banner"
                style={{ width: "100%", maxWidth: "1200px" }}
              />
              <h2 style={{
                position: "absolute",
                top: "30%",
                right: "100px",
                color: "white",
                fontWeight: "bold",
              }}>
                TAX INVOICE: {order._id.slice(-6)}
              </h2>
              <p style={{
                position: "absolute",
                top: "60%",
                right: "100px",
                color: "white"
              }}>
                {new Date(order.deliveryDate).toLocaleDateString()}
              </p>
            </div>

            <div style={{ margin: "20px auto", maxWidth: "1200px", fontSize: "12px" }}>
              {/* Address Block */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "30%" }}>
                  <h4>ERENTALS HND PVT LTD</h4>
                  <p>Shop No. 234, City Centre Mall, SV Road, Goregaon West, Mumbai, Maharashtra, 400104, India</p>
                  <p>Phone: 9867348165 / 8652348165</p>
                  <p>Email: info@erentals.in</p>
                  <p>Website: www.erentals.in</p>
                  <p>GSTN: 27AAGCE8977P1ZJ</p>
                  <p>HSN/SAC: 998596</p>
                </div>

                <div style={{ width: "30%" }}>
                  <h4>BILL TO</h4>
                  <p>{order.user?.name}</p>
                  <p>{order.shipping_address}</p>
                  <p>{order.user?.phone}</p>
                  <p>GSTN: {order.user?.gstId}</p>
                  <p>Billing Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                <div style={{ width: "30%" }}>
                  <h4>DELIVER TO</h4>
                  <p>{order.user?.name}</p>
                  <p>{order.shipping_address}</p>
                  <p>{order.user?.phone}</p>
                  <p>Delivery Date: {new Date(order.deliveryDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Items Table */}
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                <thead style={{ backgroundColor: "#002060", color: "white" }}>
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
                  {order.items.map((item, i) => (
                    <tr key={i}>
                      <td style={cellStyle}>{i + 1}</td>
                      <td style={cellStyle}>{item.product?.productCode || "-"}</td>
                      <td style={cellStyle}>{item.product?.name}</td>
                      <td style={cellStyle}>₹{item.unitPrice}</td>
                      <td style={cellStyle}>{item.quantity}</td>
                      <td style={cellStyle}>{item.rentalDays || 1}</td>
                      <td style={cellStyle}>₹{item.finalPrice}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="6" style={cellStyle}>Sub Total</td>
                    <td style={cellStyle}>₹{order.priceBeforeTax?.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="6" style={cellStyle}>Transportation</td>
                    <td style={cellStyle}>₹{order.transportationCharge?.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="6" style={cellStyle}>CGST @9%</td>
                    <td style={cellStyle}>₹{order.cgst?.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="6" style={cellStyle}>SGST @9%</td>
                    <td style={cellStyle}>₹{order.sgst?.toFixed(2)}</td>
                  </tr>
                  <tr style={{ backgroundColor: "#002060", color: "white", fontWeight: "bold" }}>
                    <td colSpan="6" style={cellStyle}>Total Payable</td>
                    <td style={cellStyle}>₹{order.finalAmount?.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              {/* Bank Note */}
              <div style={{ marginTop: "20px", fontSize: "12px" }}>
                <p>Bank Details:</p>
                <p>IndusInd Bank | A/C: ERENTALS HND PVT LTD | CURRENT</p>
                <p>IFSC: INDB0001075 | A/C No: 259867348165</p>
              </div>

              <p style={{ fontWeight: "bold", marginTop: "10px" }}>Thanks & Regards, <br /> eRentals</p>

              {/* Footer Banner */}
              <img
                src="https://res.cloudinary.com/dsc5aznps/image/upload/v1754374924/erentals/products/rznbkrrvd6f4yuwnj1tl.png"
                alt="footer"
                style={{ width: "100%", maxWidth: "1200px", marginTop: "20px" }}
              />
            </div>
          </div>

          <Button onClick={handlePrint} className="bg-green-600 text-white mt-4 hover:bg-green-700">
            🖨️ Print Invoice
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
