import footerLogo from "../assets/Group1707485521.png"

export const addFooter = (doc: jsPDF) => {
    const pageCount = doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        // Horizontal line
        doc.setDrawColor(220);
        doc.setLineWidth(0.5);
        doc.line(20, 272, 190, 272);

        // Left Section
        doc.setFontSize(9);
        doc.setTextColor("#000");
        doc.text("Vigovia Tech Pvt. Ltd", 20, 278);
        doc.setTextColor("#444");
        doc.text("Registered Office: Hd-109 Cinnabar Hills,", 20, 282);
        doc.text("Links Business Park, Karnataka, India.", 20, 286);

        // Right Section
        doc.setFontSize(9);
        doc.setTextColor("#000");
        doc.text("Phone: +91-99X9999999", 120, 278);
        doc.text("Email ID: Contact@Vigovia.Com", 120, 282);

        // Logo
        try {
            doc.addImage(footerLogo, "PNG", 160, 268, 30, 15);
        } catch {
            doc.setTextColor("red");
            doc.text("Logo not found", 160, 278);
        }
    }
};
