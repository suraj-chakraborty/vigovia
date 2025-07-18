import autoTable from "jspdf-autotable";
import type { ItineraryData, StaticData } from "../types/itinerary";

export function getCircularImageDataUrl(src, size, scale = 2) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size * scale;
        const ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);

        // Fill background with white
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, size, size);

        // Circular mask
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function () {
            ctx.drawImage(img, 0, 0, size, size);
            resolve(canvas.toDataURL('image/png'));
        };
        img.src = src;
    });
}


export function renderImportantNotesSection(doc: jsPDF, startY: number): number {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Important ", 14, startY);
    doc.setTextColor(138, 43, 226); // Purple for "Notes"
    doc.text("Notes", doc.getTextWidth("Important ") + 14, startY);

    const notes = [
        ["Airlines Standard Policy", "In Case Of Visa Rejection, Visa Fees Or Any Other Non Cancellable Component Cannot Be Reimbursed At Any Cost."],
        ["Flight/Hotel Cancellation", "In Case Of Visa Rejection, Visa Fees Or Any Other Non Cancellable Component Cannot Be Reimbursed At Any Cost."],
        ["Trip Insurance", "In Case Of Visa Rejection, Visa Fees Or Any Other Non Cancellable Component Cannot Be Reimbursed At Any Cost."],
        ["Hotel Check-In & Check Out", "In Case Of Visa Rejection, Visa Fees Or Any Other Non Cancellable Component Cannot Be Reimbursed At Any Cost."],
        ["Visa Rejection", "In Case Of Visa Rejection, Visa Fees Or Any Other Non Cancellable Component Cannot Be Reimbursed At Any Cost."],
    ];

    autoTable(doc, {
        startY: startY + 5,
        head: [["Point", "Details"]],
        body: notes,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [94, 53, 177] },
        columnStyles: {
            0: { cellWidth: 70 },
            1: { cellWidth: 120 },
        },
    });

    return doc.lastAutoTable.finalY + 5;
}



export function renderScopeOfServiceSection(doc: jsPDF, startY: number): number {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Scope Of ", 14, startY);
    doc.setTextColor(138, 43, 226); // Purple for "Service"
    doc.text("Service", doc.getTextWidth("Scope Of ") + 14, startY);

    const services = [
        ["Flight Tickets And Hotel Vouchers", "Delivered 3 Days Post Full Payment"],
        ["Web Check-In", "Boarding Pass Delivery Via Email/WhatsApp"],
        ["Support", "Chat Support – Response Time: 4 Hours"],
        ["Cancellation Support", "Provided"],
        ["Trip Support", "Response Time: 5 Minutes"],
    ];

    autoTable(doc, {
        startY: startY + 5,
        head: [["Service", "Details"]],
        body: services,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [94, 53, 177] },
        columnStyles: {
            0: { cellWidth: 70 },
            1: { cellWidth: 120 },
        },
    });

    return doc.lastAutoTable.finalY + 5;
}
export function generateItineraryPDF(doc: jsPDF, data: StaticData[]) {


    // Title
    doc.setFontSize(18);
    doc.setTextColor("#4B0074");
    doc.text("Itinerary", 14, 22);

    // Table columns
    const columns = [
        { header: "City", dataKey: "city" },
        { header: "Activity", dataKey: "activity" },
        { header: "Type", dataKey: "type" },
        { header: "Time Required", dataKey: "time" },
    ];

    // Table data
    const rows = data.map((item) => ({
        city: item.city,
        activity: item.activity,
        type: item.type,
        time: item.time,
    }));

    autoTable(doc, {
        startY: 30,
        head: [columns.map((c) => c.header)],
        body: rows.map((row) => Object.values(row)),
        styles: {
            fontSize: 10,
            textColor: "#4B0074",
            fillColor: "#F9F6FF",
        },
        headStyles: {
            fillColor: "#4B0074",
            textColor: "#ffffff",
            fontStyle: "bold",
        },
        margin: { left: 14, right: 14 },
        theme: "grid",
        didDrawPage: (data) => {
            // Footer
            doc.setFontSize(12);
            doc.setTextColor("#000000");
            doc.text("Terms and ", 14, doc.internal.pageSize.height - 30);
            doc.setTextColor("#8F00FF");
            doc.text("Conditions", 44, doc.internal.pageSize.height - 30);

            doc.setFontSize(10);
            doc.setTextColor("#4B0074");
            doc.textWithLink("View all terms and conditions", 14, doc.internal.pageSize.height - 22, {
                url: "https://your-terms-url.com",
            });
        },
    });
}


export function drawTables(doc, headings, rows, boxHeight, startX, startY, bottomBoxHeight = 20, verticalSpacing = 20) {
    console.log("headings", headings)
    console.log("rows", rows)
    console.log(boxHeight, startX, startY,)
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = startX;
    const numCols = headings.length;
    const containerWidth = pageWidth - 2 * margin;
    const colWidth = containerWidth / numCols;

    const headerHeight = 25;
    const boxRadius = 10;
    const rowHeight = 15;

    // Draw columns dynamically
    for (let i = 0; i < numCols; i++) {
        const x = margin + i * colWidth;


        // Header background (top rounded rect)
        doc.setFillColor(50, 30, 93);
        doc.roundedRect(x, startY - 5, colWidth - 5, headerHeight, boxRadius, boxRadius, "F");

        // Header Text (Installment)
        doc.setFontSize(16);
        doc.setTextColor("white");
        doc.setFont("helvetica", "bold");
        // Due Date box (bottom rounded)
        doc.setFillColor(245, 230, 255);
        doc.roundedRect(x, startY + headerHeight + boxHeight - 25, colWidth - 5, bottomBoxHeight, boxRadius, boxRadius, "F");
        doc.setFillColor(245, 230, 255);
        doc.rect(x, startY + headerHeight - boxRadius - 5, colWidth - 5, boxHeight, "F");
        doc.text(headings[i], x + colWidth / 2 - 2, startY + 5, { align: "center" });

        // const yDir = startY + i * rows.length * 5
        // Main box


        // console.log(rows[i])
        // console.log(...rows[i])
        doc.setFontSize(12)
        // let j = 0
        // let XDir = colWidth
        for (let row = 0; row < rows.length; row++) {
            for (let col = 0; col < numCols; col++) {
                const cell = rows[row][col] !== undefined ? String(rows[row][col]) : "";
                doc.setTextColor("black")
                doc.text(cell, startX + col * colWidth + 5, startY + (row + 1) * rowHeight);
            }
        }
    }
}




export function formatCustomDate(dateStr: string) {
    const date = new Date(dateStr);
    // Weekday abbreviations
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    // Month abbreviations
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const weekday = weekdays[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    // Last 2 digits of year
    const yearShort = String(date.getFullYear()).slice(-2);
    return `${weekday} ${day} ${month}'${yearShort}`;
}