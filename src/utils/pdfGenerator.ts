import jsPDF from "jspdf";
import "jspdf-autotable";

interface UserDetails {
  name: string;
  fatherName: string;
  motherName: string;
  dob: string;
  maritalStatus: string;
  number: string;
  secondaryNumber?: string;
  category: string;
  gender: string;
  address: {
    detailedAddress: string;
    tehsil: string;
    district: string;
    state: string;
    pincode: string;
  };
  email: string;
  adharNumber: string;
  signature?: string;
  photo?: string;
}

interface SubscriptionInfo {
  seatId: {
    seatNumber: string;
    type?: string;
    floor?: string;
  };
  startDate: string;
  endDate: string;
}

const getBase64ImageFromURL = (url: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = (error) => reject(error);
    img.src = url;
  });
};

export const generateAdmissionPDF = async (
  user: UserDetails,
  subscription?: SubscriptionInfo | null,
  currentUser?: any,
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Helper to load image
  const getImageData = (url: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => resolve("");
      img.src = url;
    });
  };

  const [logoData, userSigData, libSigData, userPhotoData] = await Promise.all([
    getImageData(currentUser?.logo || "/Logo.png"),
    getImageData(user.signature || ""),
    getImageData(currentUser?.signature || ""),
    getImageData(user.photo || ""),
  ]);

  // 1. Logo & Header Branding
  if (logoData) {
    doc.setFillColor(251, 191, 36); // Amber 400
    doc.rect(15, 12, 18, 18, "F");
    doc.addImage(logoData, "PNG", 15, 12, 18, 18);
  }

  doc.setTextColor(17, 24, 39); // Gray 900
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(currentUser?.name || "Library Management System", 38, 20);

  // Address line
  doc.setFillColor(49, 44, 133); // #312c85
  doc.rect(38, 23, 157, 6, "F");
  doc.setFontSize(8);
  doc.setTextColor(255);
  doc.text(currentUser?.address || "Smart Library Management System", 40, 27);

  // Contact Info below address
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  const email = currentUser?.helpDesk?.email || currentUser?.email || "N/A";
  const phone = currentUser?.helpDesk?.number || currentUser?.phone || "N/A";
  doc.text(`Email: ${email} | Phone: ${phone}`, pageWidth - 115, 34, {
    align: "right",
  });

  // Admission Form Title
  doc.setFillColor(220, 38, 38);
  doc.roundedRect(pageWidth / 2 - 30, 42, 60, 10, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("ADMISSION FORM", pageWidth / 2, 48.5, { align: "center" });

  // Right Side: Photo
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.rect(pageWidth - 45, 12, 30, 35); // Photo box
  if (userPhotoData) {
    doc.addImage(userPhotoData, "PNG", pageWidth - 45, 12, 30, 35);
  } else {
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("PHOTO", pageWidth - 30, 30, { align: "center" });
  }

  // Seat and Date Info
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");

  const seatText = subscription?.seatId
    ? `SEAT: ${subscription.seatId.seatNumber} (${subscription.seatId.type || "N/A"}) - ${subscription.seatId.floor || "N/A"}`
    : "SEAT: NOT ASSIGNED";

  doc.text(seatText, 15, 62);
  doc.text(
    `DATE: ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`,
    pageWidth - 15,
    62,
    { align: "right" },
  );

  // Personal Details Section
  doc.setLineWidth(0.2);
  doc.setDrawColor(226, 232, 240);
  doc.line(15, 68, pageWidth - 15, 68);

  const startY = 78;
  const lineSpacing = 9;
  doc.setFontSize(10);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const fields = [
    { label: "Applicant's Name", value: user.name.toUpperCase() },
    { label: "Father's Name", value: user.fatherName.toUpperCase() },
    { label: "Mother's Name", value: user.motherName.toUpperCase() },
    { label: "Date of Birth", value: formatDate(user.dob) },
    { label: "Gender / Category", value: `${user.gender} / ${user.category}` },
    { label: "Aadhar Number", value: user.adharNumber },
    { label: "Mobile Number", value: user.number },
    { label: "Secondary Number", value: user.secondaryNumber || "N/A" },
    { label: "Email Address", value: user.email },
    { label: "Marital Status", value: user.maritalStatus },
  ];

  let currentY = startY;
  fields.forEach((field) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text(`${field.label} :`, 15, currentY);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text(field.value, 65, currentY);

    doc.setDrawColor(241, 245, 249);
    doc.line(65, currentY + 1, pageWidth - 15, currentY + 1);
    currentY += lineSpacing;
  });

  // Address Section
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("Permanent Address :", 15, currentY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(user.address.detailedAddress, 65, currentY);
  doc.line(65, currentY + 1, pageWidth - 15, currentY + 1);
  currentY += lineSpacing;

  const addrLine2 = `${user.address.tehsil}, ${user.address.district}, ${user.address.state} - ${user.address.pincode}`;
  doc.text(addrLine2, 65, currentY);
  doc.line(65, currentY + 1, pageWidth - 15, currentY + 1);
  currentY += lineSpacing + 5;

  // Declaration
  doc.setFillColor(248, 250, 252);
  doc.rect(15, currentY, pageWidth - 30, 35, "F");
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, currentY, pageWidth - 30, 35, "S");

  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("DECLARATION", pageWidth / 2, currentY + 8, { align: "center" });

  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "normal");
  const declaration = `I hereby declare that I have taken admission in ${currentUser?.name || "the Library"} and I will abide by all the rules and regulations. I understand that the fee once paid is non-refundable and non-transferable. I will maintain the library's decorum and handle resources responsibly.`;
  const splitText = doc.splitTextToSize(declaration, pageWidth - 40);
  doc.text(splitText, 20, currentY + 16);

  // Footer Signatures
  const footerY = pageHeight - 45;

  // Member's Side
  if (userSigData) {
    doc.addImage(userSigData, "PNG", 25, footerY - 15, 35, 12);
  }
  doc.setDrawColor(100);
  doc.setLineWidth(0.2);
  doc.line(20, footerY, 65, footerY);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Applicant's Signature", 42.5, footerY + 6, { align: "center" });

  // Librarian's Side
  if (libSigData) {
    doc.addImage(libSigData, "PNG", pageWidth - 60, footerY - 15, 35, 12);
  }
  doc.line(pageWidth - 65, footerY, pageWidth - 20, footerY);
  doc.text("Librarian Signature", pageWidth - 42.5, footerY + 6, {
    align: "center",
  });

  // System Footer
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Generated systematically by ${currentUser?.name || "Library LMS"} on ${new Date().toLocaleString()}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" },
  );

  doc.save(`${user.name.replace(/\s+/g, "_")}_Admission_Form.pdf`);
};
