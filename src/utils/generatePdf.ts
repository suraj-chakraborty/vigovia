import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ItineraryData, StaticData } from "../types/itinerary";

import placeholderImage from "../assets/sample.jpg"
import footerLogo from "../assets/Group 1707485521.png"



function renderImportantNotesSection(doc: jsPDF, startY: number): number {
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



function renderScopeOfServiceSection(doc: jsPDF, startY: number): number {
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

export function generateItineraryPDF(doc: jsPDF, startY: number, data: StaticData[]) {


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

const addFooter = (doc: jsPDF) => {
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


const generatePdf = (data: ItineraryData) => {
    const doc = new jsPDF();
    const { name, departureCity, destinationCity, departureDate, returnDate, travelers, days, flights, bookings } = data;

    const totalDays = days.length;
    const nights = totalDays - 1;

    let y = 20;

    // Header
    doc.setFontSize(22);
    doc.setTextColor("#4F46E5");
    doc.text(`Hi, ${name}!`, 20, y);
    y += 10;
    doc.setFontSize(18);
    doc.setTextColor("black");
    doc.text(`${destinationCity} Itinerary`, 20, y);
    y += 8;
    doc.setFontSize(14);
    doc.text(`${totalDays} Days ${nights} Nights`, 20, y);

    // Trip Info Box
    y += 12;
    doc.setFontSize(12);
    doc.text(`Departure From: ${departureCity}`, 20, y);
    y += 6;
    doc.text(`Departure Date: ${departureDate}`, 20, y);
    y += 6;
    doc.text(`Return Date: ${returnDate}`, 20, y);
    y += 6;
    doc.text(`Destination: ${destinationCity}`, 20, y);
    y += 6;
    doc.text(`No. of Travellers: ${travelers}`, 20, y);


    // Day-wise activities
    days.forEach((day) => {
        if (y > 240) {
            doc.addPage();
            y = 20;
        }

        const imageSize = 30;
        const dayBoxX = 15;
        const dayBoxY = y;
        const imageX = dayBoxX + 5;
        const imageY = y + 10;

        // Left-side Day Box
        doc.setFillColor("#4F46E5");
        doc.roundedRect(dayBoxX, dayBoxY, 25, 60, 5, 5, "F");
        doc.setTextColor("white");
        doc.setFontSize(10);
        doc.text(`Day ${day.day}`, dayBoxX + 4, dayBoxY + 30, { angle: -90 });

        // Image
        try {
            doc.addImage(
                placeholderImage,
                "JPEG",
                imageX + 25,
                imageY,
                imageSize,
                imageSize,
                undefined,
                "FAST"
            );
        } catch {
            doc.setTextColor("red");
            doc.text("Image not loaded", imageX + 25, imageY + 10);
        }

        // Date & Subheading
        doc.setFontSize(11);
        doc.setTextColor("black");
        doc.text(day.date, imageX + 25, imageY + imageSize + 7);
        doc.setFontSize(9);
        doc.text("Arrival in Singapore & City Exploration", imageX + 25, imageY + imageSize + 13);

        // Vertical Timeline
        const timelineX = imageX + 65;
        const timelineY = imageY;

        const circleRadius = 2;
        doc.setDrawColor("#4F46E5");
        doc.setLineWidth(0.5);
        doc.line(timelineX, timelineY, timelineX, timelineY + 40);

        const activityTimes = ["Morning", "Afternoon", "Evening"];

        activityTimes.forEach((label, index) => {
            const circleY = timelineY + index * 20;
            const textY = circleY + 1.5;

            // Draw circle
            doc.circle(timelineX, circleY, circleRadius, "F");

            // Draw label
            doc.setTextColor("black");
            doc.setFontSize(10);
            doc.text(label + ":", timelineX + 6, textY);

            // Description
            const activity = day.activities.find((a) => a.time === label);
            if (activity && activity.description) {
                doc.setFontSize(9);
                doc.setTextColor("#444");
                doc.text(`• ${activity.description}`, timelineX + 35, textY, { maxWidth: 140 });
            }
        });

        // Line Separator
        y += 60;
        doc.setDrawColor(200);
        doc.line(20, y, 190, y);
    });



    // Flight Summary
    if (flights.length > 0) {
        if (y > 180) {
            doc.addPage();
            y = 20;
        }

        doc.setFontSize(14);
        doc.setTextColor("#6D28D9"); // Purple
        doc.text("Flight Summary", 20, y);
        y += 10;

        flights.forEach((f) => {
            if (y > 240) {
                doc.addPage();
                y = 20;
            }

            const boxX = 20;
            const boxY = y;
            const boxWidth = 170;
            const boxHeight = 18;

            // Box with border and arrow effect (optional)
            doc.setDrawColor(180);
            doc.setLineWidth(0.5);
            doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 4, 4);

            // Date section (left highlight)
            doc.setFillColor("#EDE9FE"); // light purple
            doc.rect(boxX, boxY, 40, boxHeight, "F");

            doc.setTextColor("#6D28D9"); // date text color
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text(f.departureDate || "N/A", boxX + 5, boxY + 12);

            // Flight info on right
            const infoX = boxX + 45;
            doc.setFontSize(11);
            doc.setTextColor("black");

            const airline = "Fly Air India"; // You can make this dynamic
            const fromCity = f.from || "N/A";
            const toCity = f.to || "N/A";

            doc.setFont("helvetica", "bold");
            doc.text(airline, infoX, boxY + 8);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor("#444");
            doc.text(`From ${fromCity} (${fromCity.slice(0, 3).toUpperCase()}) To ${toCity} (${toCity.slice(0, 3).toUpperCase()})`, infoX, boxY + 14);

            y += boxHeight + 6;
        });

        // Flight info note
        if (y > 270) {
            doc.addPage();
            y = 20;
        }

        doc.setFontSize(8);
        doc.setTextColor("gray");
        doc.text("Note: All Flights Include Meals, Seat Choice (Excluding XL), and 20kg/25kg Checked Baggage.", 20, y);
        y += 10;
    }

    // Hotel Booking Summary
    if (bookings.length > 0) {
        if (y > 200) {
            doc.addPage();
            y = 20;
        }

        doc.setFontSize(14);
        doc.setTextColor("#9333EA"); // Purple
        doc.text("Hotel Bookings", 20, y);
        y += 8;

        autoTable(doc, {
            startY: y,
            head: [["City", "Check In", "Check Out", "Nights", "Hotel Name"]],
            body: bookings.map((b) => [
                b.city,
                b.checkIn,
                b.checkOut,
                b.nights.toString(),
                b.hotelName,
            ]),
            theme: "striped",
            margin: { bottom: 40 },
            styles: {
                fontSize: 10,
                halign: "left",
                valign: "middle",
            },
            headStyles: {
                fillColor: [79, 70, 229], // Indigo
                textColor: 255,
                fontSize: 11,
            },
        });

        y = (doc as any).lastAutoTable.finalY + 10;

        // Notes
        const notes = [
            "1. All Hotels Are Tentative And Can Be Replaced With Similar.",
            "2. Breakfast Included For All Hotel Stays.",
            "3. All Hotels Will Be 4* And Above Category.",
            "4. A maximum occupancy of 2 people/room is allowed in most hotels.",
        ];
        doc.setFontSize(9);
        doc.setTextColor("#000");
        notes.forEach((line) => {
            doc.text(line, 20, y);
            y += 5;
        });
    }


    // Section: Important Notes + Scope of Service
    const bottomMargin = 30;

    if (y > doc.internal.pageSize.height - bottomMargin) {
        doc.addPage();
        y = 20;
    }
    y = renderImportantNotesSection(doc, y);

    if (y > doc.internal.pageSize.height - bottomMargin) {
        doc.addPage();
        y = 20;
    }
    y = renderScopeOfServiceSection(doc, y);
    if (y > doc.internal.pageSize.height - bottomMargin) {
        doc.addPage();
        y = 40;
    }

    let data1 = [
        {
            city: "Rio De Janeiro",
            activity: "Sydney Harbour Cruise & Taronga Zoo",
            type: "Airlines Standard",
            time: "2-3 Hours",
        },

        {
            city: "Sydney",
            activity: "Sydney Opera House Tour",
            type: "Airlines Standard",
            time: "1-2 Hours",
        },
        {
            city: "Sydney",
            activity: "Bondi Beach Relaxation",
            type: "Airlines Standard",
            time: "2-3 Hours",
        },

    ];

    y = generateItineraryPDF(doc, y, data1);


    // Footer
    addFooter(doc);
    // Save PDF
    doc.save(`${name}_itinerary.pdf`);
};

export default generatePdf;
