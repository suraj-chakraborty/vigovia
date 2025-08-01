import footerLogo from "../assets/Group1707485521.png"
import { jsPDF } from "jspdf";
export const addFooter = (doc: jsPDF) => {
    const pageCount = doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        // // Horizontal line
        // doc.setDrawColor(220);
        // doc.setLineWidth(0.5);
        // doc.line(20, 272, 190, 272);

        // Left Section
        doc.setFontSize(9);
        doc.setTextColor("#000");
        doc.text("Vigovia Tech Pvt. Ltd", 15, 278);
        doc.setTextColor("#444");
        doc.text("Registered Office: Hd-109 Cinnabar Hills,", 15, 282, { align: "left" });
        doc.text("Links Business Park, Karnataka, India.", 15, 286);

        // Right Section
        doc.setFontSize(9);
        doc.setTextColor("#000");
        doc.text("Phone: +91-99X9999999", 90, 278);
        doc.text("Email ID: Contact@Vigovia.Com", 90, 282, { align: "left" });

        // Logo
        try {
            doc.addImage(footerLogo, "PNG", 170, 275, 30, 15,);
        } catch {
            doc.setTextColor("red");
            doc.text("Logo not found", 170, 278);
        }
    }
};
