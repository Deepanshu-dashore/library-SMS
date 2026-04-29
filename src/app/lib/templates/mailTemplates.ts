export class MailTemplates {
  /**
   * Generates a premium payment receipt email template that matches the A4 Invoice layout
   */
  static paymentReceipt(payment: any, library: any, receiptLink?: string) {
    const seat = payment.subscriptionId?.seatId;
    const user = payment.userId;
    const capitalizedName = user?.name?.replace(/\b\w/g, (l: string) => l.toUpperCase());
    const year = new Date().getFullYear();
    const formattedDate = new Date(payment.createdAt).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });
    const startDate = new Date(payment.subscriptionId.startDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });
    const endDate = new Date(payment.subscriptionId.endDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f1f5f9; }
          .container { max-width: 700px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; }
          .header { background-color: #312c85; padding: 30px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; }
          .header p { margin: 10px 0 0 0; font-size: 14px; color: #e2e8f0; font-family: monospace; }
          .content { padding: 40px; }
          .billed-to { margin-bottom: 30px; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; }
          .billed-to p { margin: 0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; }
          .billed-to h2 { margin: 5px 0 0 0; color: #1e293b; font-size: 22px; font-weight: 700; text-transform: capitalize; }
          .details-section { margin-bottom: 30px; }
          .details-section h3 { font-size: 16px; color: #1e293b; border-bottom: 2px solid #312c85; display: inline-block; padding-bottom: 5px; margin-bottom: 20px; }
          .details-table { width: 100%; border-collapse: collapse; }
          .details-table td { padding: 10px 0; color: #475569; font-size: 14px; border-bottom: 1px solid #f8fafc; }
          .details-table td.label { font-weight: 700; color: #1e293b; width: 40%; }
          .amount-section { background-color: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #312c85; }
          .amount-table { width: 100%; }
          .amount-table td { font-size: 18px; font-weight: 700; color: #1e293b; }
          .amount-table .price { font-size: 28px; color: #312c85; text-align: right; }
          .signature-section { margin-top: 40px; }
          .signature-img { height: 50px; margin-bottom: 5px; }
          .signature-line { border-top: 1px dashed #cbd5e1; width: 200px; padding-top: 5px; font-size: 12px; font-weight: 700; color: #64748b; }
          .footer { background-color: #f8fafc; padding: 30px; border-top: 1px solid #e2e8f0; text-align: left; }
          .footer h4 { margin: 0 0 10px 0; font-size: 13px; color: #1e293b; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; display: inline-block; }
          .contact-info { font-size: 12px; color: #64748b; line-height: 1.6; }
          .copyright { text-align: center; padding: 20px; font-size: 11px; color: #94a3b8; }
          .btn-container { text-align: center; margin: 30px 0; }
          .btn { background-color: #312c85; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px rgba(49, 44, 133, 0.2); }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Receipt</h1>
            <p>REC - ${payment.receiptNumber}</p>
          </div>
          
          <div class="content">
            <div class="billed-to">
              <p>Billed To</p>
              <h2>${capitalizedName}</h2>
              <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Generated On: ${formattedDate}</div>
            </div>

            <div class="details-section">
              <h3>Membership Details</h3>
              <table class="details-table">
                <tr>
                  <td class="label">Seat Number (Type)</td>
                  <td>${seat?.seatNumber} (${seat?.type?.toUpperCase()})</td>
                </tr>
                <tr>
                  <td class="label">Floor</td>
                  <td>${seat?.floor || "Ground"}</td>
                </tr>
                <tr>
                  <td class="label">Payment Method</td>
                  <td>${payment.paymentMode.toUpperCase()}</td>
                </tr>
                <tr>
                  <td class="label">Payment Date</td>
                  <td>${formattedDate}</td>
                </tr>
                <tr>
                  <td class="label">Subscription Period</td>
                  <td>${startDate} To ${endDate}</td>
                </tr>
              </table>
            </div>

            <div class="amount-section">
              <table class="amount-table">
                <tr>
                  <td>Amount Paid</td>
                  <td class="price">₹${payment.amount}</td>
                </tr>
              </table>
            </div>

            ${receiptLink ? `
            <div class="btn-container">
              <a href="${receiptLink}" class="btn">Download Official PDF Receipt</a>
            </div>
            ` : ''}

            <div class="signature-section">
              ${library.signature ? `<img src="${library.signature}" class="signature-img" alt="Authorized Signature">` : '<div style="height: 50px;"></div>'}
              <div class="signature-line">Authorized Signature</div>
            </div>

            <div style="margin-top: 30px; font-size: 12px; color: #94a3b8; font-style: italic;">
              Note: This is a system-generated receipt. For any corrections, please contact support.
            </div>
          </div>

          <div class="footer">
            <h4>Help Desk & Contact Information</h4>
            <div class="contact-info">
              <div><strong>Address:</strong> ${library.address}</div>
              <div><strong>Email:</strong> ${library.helpDesk?.email || library.email} | <strong>Phone:</strong> ${library.helpDesk?.number || library.phone}</div>
              <div><strong>Hours:</strong> ${library.helpDesk?.hours || "09:00 AM - 08:00 PM"}</div>
            </div>
          </div>
          
          <div class="copyright">
            © ${year} ${library.name}. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
