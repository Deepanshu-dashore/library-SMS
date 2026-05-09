export class MailTemplates {
  /**
   * Generates a premium payment successful email template.
   * Minimalist Professional Look: /Recipet.png bg, Square Amber Logo + Indigo Address Bar,
   * Navbar Green Button (#155440), and Inline PDF-style Footer.
   */
  static paymentReceipt(payment: any, library: any, receiptLink?: string) {
    const seat = payment.subscriptionId?.seatId;
    const user = payment.userId;
    const capitalizedName =
      user?.name?.replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Member";

    const year = new Date().getFullYear();
    const baseUrl = process.env.ONLINE_URL?.replace(/\/$/, "") || "";

    const makeAbsolute = (url: string) => {
      if (!url) return "";
      if (url.startsWith("http")) return url;
      return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
    };

    const fmt = (d: string) =>
      new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    const formattedDate = fmt(payment.createdAt);
    const startDate = fmt(payment.subscriptionId.startDate);
    const endDate = fmt(payment.subscriptionId.endDate);

    const bgImage = makeAbsolute("/Recipet.png");
    const logoImage = makeAbsolute(
      library.logo || library.photo || "/Logo.png",
    );

    const libEmail =
      library.helpDesk?.email || library.email || "support@sawariyalibrary.in";
    const libPhone =
      library.helpDesk?.number || library.phone || "+91 8305818506";
    const libHours = library.helpDesk?.hours || "09:00 AM – 08:00 PM";
    const libAddress =
      library.helpDesk?.address || library.address || "DLF Cyber City, Gurgaon";

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Successful</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    body { margin: 0; padding: 0; background: #e8edf2; font-family: 'Inter', sans-serif; color: #1e293b; }
    table { border-spacing: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; display: block; line-height: 1; }

    .wrap { width: 100%; background: #e8edf2; padding: 40px 12px; }
    .card {
      max-width: 560px; margin: 0 auto;
      background: #ffffff url('${bgImage}') center/cover no-repeat;
      border: 1px solid #e2e8f0;
      overflow: hidden;
    }

    /* Header: Square Amber Logo + Indigo Address Bar */
    .hdr { padding: 30px 30px 20px; background: rgba(255, 255, 255, 0.7); border-bottom: 1px solid #f1f5f9; text-align: left; }
    .logo-box { width: 56px; height: 56px; background: #fbbf24; overflow: hidden; display: inline-block; vertical-align: middle; }
    .logo-img { width: 100%; height: 100%; object-fit: cover; }
    .brand-info { display: inline-block; vertical-align: middle; margin-left: 15px; }
    .lib-name { font-size: 20px; font-weight: 800; color: #111827; margin: 0; text-transform: capitalize; }
    .lib-addr-tag { font-size: 10px; font-weight: 500; color: #ffffff; background: #312c85; padding: 3px 8px; margin-top: 5px; display: inline-block; letter-spacing: 0.5px; }

    /* Meta Info Bar */
    .meta-bar { padding: 12px 30px; background: rgba(255, 255, 255, 0.5); border-bottom: 1px solid #f1f5f9; }
    .m-lbl { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
    .m-val { font-size: 13px; font-weight: 700; color: #111827; margin-top: 2px; }

    /* Body: Minimalist Content */
    .body { padding: 30px; background: rgba(255, 255, 255, 0.6); }
    .sec-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 5px; }
    .mem-name { font-size: 24px; font-weight: 800; color: #0f172a; text-transform: capitalize; margin-bottom: 2px; }
    .mem-email { font-size: 13px; color: #64748b; margin-bottom: 25px; }

    .divider { height: 1px; background: #f1f5f9; margin: 20px 0; }
    .dash-div { border: none; border-top: 1px dashed #e2e8f0; margin: 20px 0; }

    /* Details Table */
    .dt-row td { padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .dt-label { color: #64748b; font-weight: 500; }
    .dt-value { color: #0f172a; font-weight: 700; text-align: right; }

    /* Amount Section */
    .amt-row td { padding: 20px 0; vertical-align: middle; }
    .amt-label { font-size: 14px; font-weight: 600; color: #334155; }
    .amt-value { font-size: 32px; font-weight: 800; color: #312c85; text-align: right; }

    /* Button: Navbar Green (#155440) */
    .btn-wrap { text-align: center; margin-top: 30px; }
    .btn { background-color: #155440; color: #ffffff !important; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block; transition: background 0.2s; }

    /* Footer: Inline PDF Style */
    .footer { padding: 20px 30px; background: rgba(255, 255, 255, 0.5); border-top: 1px solid #f1f5f9; font-size: 11px; color: #64748b; line-height: 1.8; }
    .ftr-title { font-size: 10px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
    .ftr-sep { margin: 0 8px; color: #f1f5f9; }
    .copyright { margin-top: 10px; font-size: 10px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <!-- HEADER -->
      <div class="hdr">
        <div class="logo-box">
          <img src="${logoImage}" alt="Logo" class="logo-img">
        </div>
        <div class="brand-info">
          <h1 class="lib-name">${library.name || "Library Management"}</h1>
          <div class="lib-addr-tag">${libAddress}</div>
        </div>
      </div>

      <!-- META BAR -->
      <div class="meta-bar">
        <table width="100%">
          <tr>
            <td>
              <div class="m-lbl">Receipt Number</div>
              <div class="m-val">#${payment.receiptNumber}</div>
            </td>
            <td align="right">
              <div class="m-lbl">Date Issued</div>
              <div class="m-val">${formattedDate}</div>
            </td>
          </tr>
        </table>
      </div>

      <!-- BODY -->
      <div class="body">
        <div class="sec-label">Billed To</div>
        <div class="mem-name">${capitalizedName}</div>
        <div class="mem-email">${user?.email || "Member"}</div>

        <div class="divider"></div>

        <div class="sec-label">Membership Summary</div>
        <table width="100%" class="dt-row">
          <tr>
            <td class="dt-label">Seat Assignment</td>
            <td class="dt-value">${seat?.seatNumber || "--"} (${seat?.type?.toUpperCase() || "STANDARD"})</td>
          </tr>
          <tr>
            <td class="dt-label">Floor</td>
            <td class="dt-value">${seat?.floor || "Ground Floor"}</td>
          </tr>
          <tr>
            <td class="dt-label">Payment Mode</td>
            <td class="dt-value" style="text-transform: capitalize;">${payment.paymentMode || "Cash"}</td>
          </tr>
          <tr>
            <td class="dt-label" style="border-bottom: 0;">Validity</td>
            <td class="dt-value" style="border-bottom: 0;">${startDate} - ${endDate}</td>
          </tr>
        </table>

        <div class="dash-div"></div>

        <table width="100%" class="amt-row">
          <tr>
            <td class="amt-label">Amount Successfully Paid</td>
            <td class="amt-value">₹${payment.amount}</td>
          </tr>
        </table>

        ${
          receiptLink
            ? `
        <div class="btn-wrap">
          <a href="${receiptLink}" class="btn">View Online Receipt</a>
        </div>
        `
            : ""
        }
      </div>

      <!-- FOOTER -->
      <div class="footer">
        <div class="ftr-title">Help Desk & Contact Information</div>
        <div>Address: ${libAddress}</div>
        <div>
          Email: ${libEmail}
          <span class="ftr-sep">|</span>
          Phone: ${libPhone}
          <span class="ftr-sep">|</span>
          Hours: ${libHours}
        </div>
        <div class="copyright">
          &copy; ${year} ${library.name || "Sawariya Library"}. All rights reserved. &middot; Automated Message.
        </div>
      </div>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Generates a high-fidelity security alert email for password updates
   */
  static passwordSecurityAlert({
    name,
    logoUrl,
    libraryName,
    supportEmail,
    resetLink,
  }: any) {
    const year = new Date().getFullYear();

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Alert</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    body { margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Inter', -apple-system, sans-serif; }
    table { border-spacing: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding: 40px 10px; }
    .container { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 500px; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
    
    .header { padding: 40px 30px 20px 30px; text-align: center; }
    .logo-container { width: 70px; height: 70px; background-color: #fbbf24; border-radius: 18px; overflow: hidden; display: inline-block; margin-bottom: 20px; }
    .logo-img { width: 100%; height: 100%; object-fit: cover; display: block; }
    
    .lib-name { font-size: 20px; font-weight: 800; color: #1e293b; margin: 0; text-transform: capitalize; }
    .alert-badge { background-color: #fee2e2; color: #b91c1c; font-size: 10px; font-weight: 800; padding: 6px 14px; border-radius: 999px; margin-top: 15px; display: inline-block; text-transform: uppercase; letter-spacing: 1.5px; }
    
    .content { padding: 0 35px 40px 35px; }
    .main-title { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 20px 0; line-height: 1.3; }
    .greeting { font-size: 15px; font-weight: 600; color: #334155; margin-bottom: 12px; }
    .text { font-size: 14px; line-height: 1.6; color: #64748b; margin-bottom: 20px; }
    
    .warning-box { background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 16px; padding: 20px; margin: 30px 0; }
    .warning-title { font-size: 14px; font-weight: 700; color: #be123c; margin-bottom: 8px; display: block; }
    .warning-text { font-size: 13px; line-height: 1.5; color: #9f1239; margin: 0; }
    
    .btn-container { text-align: center; margin-top: 20px; }
    .btn { background-color: #e11d48; color: #ffffff !important; padding: 18px 32px; border-radius: 16px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(225, 29, 72, 0.2); }
    
    .footer { background-color: #f8fafc; padding: 35px; border-top: 1px solid #f1f5f9; text-align: center; }
    .help-text { font-size: 12px; color: #94a3b8; margin-bottom: 15px; }
    .support-link { color: #312c85; text-decoration: none; font-weight: 600; }
    .copyright { font-size: 11px; color: #cbd5e1; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo-container">
          <img src="${logoUrl || "/Logo.png"}" alt="Logo" class="logo-img">
        </div>
        <h1 class="lib-name">${libraryName || "Library Management"}</h1>
        <div class="alert-badge">Security Alert</div>
      </div>

      <div class="content">
        <h2 class="main-title">Password changed in your account</h2>
        
        <div class="greeting">Hello ${name || "Member"},</div>
        <p class="text">
          This is a confirmation that the password for your <strong>${libraryName}</strong> account was recently updated.
          If you made this change, no further action is required.
        </p>

        <!-- Critical Warning -->
        <div class="warning-box">
          <span class="warning-title">Did you not change your password?</span>
          <p class="warning-text">
            If you did NOT initiate this change, your account may be compromised. Please reset your password immediately to secure your information.
          </p>
        </div>

        <div class="btn-container">
          <a href="${resetLink}" class="btn">Reset Password Now</a>
        </div>
      </div>

      <div class="footer">
        <p class="help-text">
          Need help? Contact our security team at <br>
          <a href="mailto:${supportEmail}" class="support-link">${supportEmail}</a>
        </p>
        <div class="copyright">
          &copy; ${year} ${libraryName}. All rights reserved.
        </div>
      </div>
    </div>
  </div>
</body>
</html>
    `;
  }
}
