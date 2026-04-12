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
  seatId: { seatNumber: string };
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
  subscription?: SubscriptionInfo | null
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header - Shri Sanwariya Library
  doc.setTextColor(220, 38, 38); // Red color for heading
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Shri Sanwariya Library", pageWidth / 2, 20, { align: "center" });

  doc.setTextColor(100, 116, 139); // Slate color for sub-info
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Jyoti Nagar, behind Petrol Pump, Bistan Road, Khargone",
    pageWidth / 2,
    26,
    { align: "center" }
  );
  doc.text("Mo. 8349222008", pageWidth / 2, 31, { align: "center" });

  // Admission Form Title
  doc.setFillColor(220, 38, 38);
  doc.roundedRect(pageWidth / 2 - 25, 38, 50, 8, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text("Admission Form", pageWidth / 2, 43.5, { align: "center" });

  // Seat and Date Info
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`SEAT No. : ${subscription?.seatId?.seatNumber || "N/A"}`, 15, 55);
  doc.text(`Date : ${new Date().toLocaleDateString("en-IN")}`, pageWidth - 15, 55, { align: "right" });

  // Draw Photo Box
  doc.setDrawColor(203, 213, 225);
  doc.rect(pageWidth - 45, 15, 30, 35); // Photo box
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  if (user.photo) {
    try {
      const photoBase64 = (await getBase64ImageFromURL(user.photo)) as string;
      doc.addImage(photoBase64, "PNG", pageWidth - 45, 15, 30, 35);
    } catch (e) {
      doc.text("Photo Here", pageWidth - 30, 32.5, { align: "center" });
    }
  } else {
    doc.text("Photo Here", pageWidth - 30, 32.5, { align: "center" });
  }

  // Draw Signature Box
  doc.rect(pageWidth - 45, 60, 30, 12);
  if (user.signature) {
    try {
      const sigBase64 = (await getBase64ImageFromURL(user.signature)) as string;
      doc.addImage(sigBase64, "PNG", pageWidth - 45, 60, 30, 12);
    } catch (e) {
      doc.text("Signature", pageWidth - 30, 67, { align: "center" });
    }
  } else {
    doc.text("Signature", pageWidth - 30, 67, { align: "center" });
  }

  // Personal Details Section
  doc.setLineWidth(0.1);
  doc.line(15, 75, pageWidth - 15, 75);

  const startY = 85;
  const lineSpacing = 10;
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "normal");

  const fields = [
    { label: "Applicant's Name:", value: user.name.toUpperCase() },
    { label: "Father's Name:", value: user.fatherName.toUpperCase() },
    { label: "Mother's Name:", value: user.motherName.toUpperCase() },
    { label: "Date of Birth:", value: user.dob },
    { label: "Marital Status:", value: user.maritalStatus },
    { label: "Mobile No.:", value: user.number },
    { label: "Other Contact No.:", value: user.secondaryNumber || "N/A" },
    { label: "Email ID:", value: user.email },
    { label: "Category:", value: user.category },
    { label: "Gender:", value: user.gender },
    { label: "Aadhar No.:", value: user.adharNumber },
  ];

  let currentY = startY;
  fields.forEach((field) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text(field.label, 15, currentY);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.text(field.value, 60, currentY);
    
    doc.setDrawColor(241, 245, 249);
    doc.line(60, currentY + 1, pageWidth - 15, currentY + 1);
    currentY += lineSpacing;
  });

  // Address Section
  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("Permanent Address:", 15, currentY);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);
  doc.text(user.address.detailedAddress, 60, currentY);
  doc.line(60, currentY + 1, pageWidth - 15, currentY + 1);
  currentY += lineSpacing;

  const addrFields = [
    { label: "Tehsil:", value: user.address.tehsil },
    { label: "District:", value: user.address.district },
    { label: "Pin Code:", value: user.address.pincode },
    { label: "State:", value: user.address.state },
  ];

  addrFields.forEach((field, index) => {
    const xPos = index % 2 === 0 ? 15 : pageWidth / 2;
    const valX = index % 2 === 0 ? 35 : pageWidth / 2 + 20;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text(field.label, xPos, currentY);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.text(field.value, valX, currentY);
    doc.line(valX, currentY + 1, valX + 40, currentY + 1);

    if (index % 2 !== 0) {
      currentY += lineSpacing;
    }
  });

  // Declaration
  currentY += 10;
  doc.setFillColor(254, 242, 242);
  doc.rect(15, currentY, pageWidth - 30, 40, "F");
  
  doc.setTextColor(185, 28, 28);
  doc.setFont("helvetica", "bold");
  doc.text("Declaration", pageWidth / 2, currentY + 8, { align: "center" });

  doc.setFontSize(8);
  doc.setTextColor(127, 29, 29);
  doc.setFont("helvetica", "normal");
  const declaration = "I hereby declare that I have taken admission in Shri Sanwariya Library and I will pay the monthly fees on time. I will follow all the rules and regulations of the library. Fee once paid will not be refunded or adjusted.";
  const splitText = doc.splitTextToSize(declaration, pageWidth - 40);
  doc.text(splitText, 20, currentY + 18);

  // Footer Signatures
  currentY += 60;
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text("Member's Signature", 15, currentY);
  doc.text("Librarian's Signature", pageWidth - 15, currentY, { align: "right" });

  doc.save(`${user.name.replace(/\s+/g, "_")}_Admission_Form.pdf`);
};
