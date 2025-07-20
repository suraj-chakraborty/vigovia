/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import jsPDF from "jspdf";
import type { ItineraryData } from "../types/itinerary";
import icon1 from "../assets/material-symbols_flight.png";
import icon2 from "../assets/fluent_building-32-filled.png";
import icon3 from "../assets/Vector.png";
import icon4 from "../assets/bxs_taxi.png";
import icon5 from "../assets/visapurple1.png";
import image from "../assets/Rectangle5679.png"
import blob from "../assets/Rectangle5688.png"
import placeholderImage from "../assets/sample.jpg"
import { drawTables, formatCustomDate, getCircularImageDataUrl } from "./PDFfunctions";
import { addFooter } from "./PDFFooter";
import footerLogo from "../assets/Group1707485521.png"
import Button from "../assets/Rectangle423.png"
import "../assets/fonts/Roboto-normal.js"
import "../assets/fonts/Roboto-Bold-bold.js"
import "../assets/fonts/Roboto-Bold-bold.js"
import "../assets/fonts/Roboto-Light-normal.js"




const generatePdf = async (data: ItineraryData) => {

    const doc = new jsPDF();
    console.log(doc.getFontList())

    let y = 20;
    //logo 
    const logoBase64 = footerLogo;
    const logoWidth = 50; // Adjust size as needed
    const logoHeight = 20;
    const logoPageWidth = doc.internal.pageSize.getWidth();

    // Centered X position
    const logoX = (logoPageWidth - logoWidth) / 2;
    const logoY = 2; // Top padding

    // Add the image
    doc.addImage(logoBase64, "PNG", logoX, logoY, logoWidth, logoHeight);

    // Push `y` down after logo to avoid overlap
    y = logoY + logoHeight + 10;

    const { name, departureCity, destinationCity, departureDate, returnDate, travelers, days, flights, bookings, payments, installments } = data;



    const departure = new Date(departureDate);
    const returning = new Date(returnDate);
    const diffInMs = returning.getTime() - departure.getTime();
    const totalDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    // console.log(totalDays)
    const nights = totalDays - 1;


    const HpageWidth = doc.internal.pageSize.getWidth();
    // Box dimensions
    const HboxY = 22;
    const HboxWidth = 170;
    const HboxHeight = 40;
    const HstartX = (HpageWidth - HboxWidth) / 2;
    // const HcolWidth = HboxWidth / Hcolumns;

    // Header
    doc.roundedRect(HstartX, HboxY, HboxWidth, HboxHeight, 4, 4);
    doc.addImage(image, "PNG", HstartX - 8, HboxY, HboxWidth + 10, HboxHeight);
    doc.setFontSize(22);
    doc.setTextColor("#ffffff");
    doc.text(`Hi, ${name}!`, HpageWidth / 2, y, { align: "center" });
    y += 10;
    doc.setFontSize(18);
    doc.setTextColor("white");
    doc.text(`${destinationCity} Itinerary`, HpageWidth / 2, y, { align: "center" });
    y += 8;
    doc.setFontSize(14);
    doc.setTextColor("#ffffff");
    doc.text(`${totalDays} Days ${nights} Nights`, HpageWidth / 2, y, { align: "center" });
    y += 5
    // Constants
    const iconSize = 4;
    const spacing = 5;
    const numIcons = 5;
    const IconpageWidth = doc.internal.pageSize.getWidth();

    const totalIconsWidth = iconSize * numIcons + spacing * (numIcons - 1);
    const IconstartX = (IconpageWidth - totalIconsWidth) / 2;
    const iconY = y;

    const icons = [icon1, icon2, icon3, icon4, icon5];

    icons.forEach((icon, index) => {
        const x = IconstartX + index * (iconSize + spacing);
        doc.addImage(icon, "PNG", x, iconY, iconSize, iconSize);
    });

    // Optional: update y for future elements if needed
    y = iconY + iconSize + 10;

    //!--------------------------------------------------------------------
    // Trip Info Box (Centered Content)
    y += 12;
    doc.setFontSize(10);


    const pageWidth = doc.internal.pageSize.getWidth();
    // Box dimensions
    const boxY = y - 10;
    const boxWidth = 180;
    const boxHeight = 15;
    const columns = 5;
    const startX = (pageWidth - boxWidth) / 2;
    const colWidth = boxWidth / columns;

    // Draw border box
    doc.setDrawColor(180);
    doc.setLineWidth(0.5);
    doc.roundedRect(startX - 2, boxY - 5, boxWidth, boxHeight, 4, 4);

    // Labels and values
    const labels = ["Departure From:", "Departure:", "Arrival:", "Destination:", "No. of Travellers:"];
    const values = [departureCity, departureDate, returnDate, destinationCity, String(travelers)];

    labels.forEach((label, index) => {
        const colStartX = startX + colWidth * index;
        const centerX = colStartX + colWidth / 2;
        // Label
        doc.setFont("Roboto", 'normal');
        doc.setTextColor(80);
        doc.text(label, centerX, y - 10, { align: "center" });

        // Value
        doc.setFont("Roboto", 'normal');
        doc.setTextColor(0);
        doc.text(values[index], colStartX + 5, y - 5, { align: "left" });
    });

    y += boxHeight - 5;

    //!--------------------------------------------------------------------
    // Day-wise activities
    for (const day of days) {
        if (y > 240) {
            doc.addPage();
            y = 20;
        }

        const imageSize = 30;
        const dayBoxX = 15;
        const dayBoxY = y + 3;
        const imageX = dayBoxX + 5;
        const imageY = y + 10;


        // Left-side Day Box
        doc.setFillColor("#321E5D");
        doc.roundedRect(dayBoxX, dayBoxY, 12, 50, 5, 5, "F");
        doc.setTextColor("white");
        doc.setFontSize(15);
        doc.setFont("Roboto", "normal")
        doc.text(`Day ${day.day}`, dayBoxX + 14, dayBoxY + 30, { angle: 90, align: "center" });

        // Image
        try {

            const circularImg = await getCircularImageDataUrl(day.image || placeholderImage, imageSize);
            doc.addImage(circularImg, "PNG", imageX + 25, imageY, imageSize, imageSize);
            doc.setDrawColor("#4F46E5");
            doc.setLineWidth(1);
            doc.circle(imageX + 25 + imageSize / 2, imageY + imageSize / 2, imageSize / 2, "S");
        } catch {
            doc.setTextColor("red");
            doc.text("Image not loaded", imageX + 25, imageY + 10);
        }

        // Date & Subheading
        // Center position for the text (you can calculate based on page width if needed)
        const centerX = imageX + imageSize / 2;

        // normal date line
        doc.setFont("Roboto", "normal");
        doc.setFontSize(11);
        doc.setTextColor("black");
        doc.text(day.formattedDate, centerX + 22, imageY + imageSize + 7, { align: "center" });

        // Description line (normal font)
        // Prepare description text
        const description = "Arrival in Singapore & City Exploration";
        doc.setFont("Roboto", "normal");
        doc.setFontSize(9);

        // Split the text if too long (e.g., max width of 70 units)
        const lines = doc.splitTextToSize(description, 40);

        // Print each line with vertical spacing
        const startY = imageY + imageSize + 13;
        lines.forEach((line, index) => {
            doc.text(line, centerX + 20, startY + index * 5, { align: "center" });
        });


        // Vertical Timeline
        const timelineX = imageX + 65;
        const timelineY = imageY;

        const circleRadius = 2;
        doc.setDrawColor("#000");
        doc.setLineWidth(0.5);
        doc.line(timelineX, timelineY, timelineX, timelineY + 40);

        const activityTimes = ["Morning", "Afternoon", "Evening"];

        activityTimes.forEach((label, index) => {
            const circleY = timelineY + index * 20;
            const textY = circleY + 1.5;

            // Draw circle
            doc.setDrawColor("#000");
            doc.setFillColor("white")
            doc.circle(timelineX, circleY, circleRadius, "DF");

            // Draw label
            doc.setTextColor("black");
            doc.setFontSize(10);
            doc.setFont("Roboto", "normal")
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
    };



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
            const boxHeight = 15;

            // Box with border and arrow effect (optional)
            doc.setDrawColor(180);
            doc.setLineWidth(0.5);
            doc.roundedRect(boxX, boxY, boxWidth, boxHeight - 3, 2, 2);

            // Date section (left highlight)
            doc.setFillColor("#EDE9FE"); // light purple
            doc.addImage(blob, boxX, boxY, 40, boxHeight - 3, "F");

            doc.setTextColor("#000"); // date text color
            doc.setFontSize(12);
            doc.setFont("Roboto", "normal");
            doc.text(formatCustomDate(f.departureDate || "N/A"), boxX + 5, boxY + 8);

            // Flight info on right
            const infoX = boxX + 45;
            doc.setFontSize(11);
            doc.setTextColor("black");

            const airline = f.flightName; // You can make this dynamic
            const fromCity = f.from || "N/A";
            const toCity = f.to || "N/A";

            doc.setFont("Roboto", "normal");
            doc.text(airline, infoX, boxY + 8);
            // Measure width of airline text to offset the next part
            const airlineWidth = doc.getTextWidth(airline + " ");

            doc.setFont("Roboto", "normal");
            doc.setFontSize(10);
            doc.setTextColor("#444");
            const textRoute = `From ${fromCity} (${fromCity.slice(0, 3).toUpperCase()}) To ${toCity} (${toCity.slice(0, 3).toUpperCase()})`;
            doc.text(textRoute, infoX + airlineWidth, boxY + 8);
            y += boxHeight + 6;
        });

        if (y > 270) {
            doc.addPage();
            y = 20;
        }

        doc.setFontSize(8);
        doc.setTextColor("gray");
        doc.text("Note: All Flights Include Meals, Seat Choice (Excluding XL), and 20kg/25kg Checked Baggage.", 20, y);
        y += 5;
        doc.setDrawColor(200);
        doc.line(20, y, 190, y);
        y += y + 20
    }

    const pageHeight = doc.internal.pageSize.getHeight();
    const componentHeight = 60;
    // Hotel Booking Summary
    if (bookings.length > 0) {
        if (y + componentHeight > pageHeight - 20) {
            doc.addPage();
            y = 20;
        }

        doc.setFontSize(14);
        doc.setFont("Roboto", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text("Hotel ", 15, y - componentHeight);
        doc.setTextColor(138, 43, 226); // Purple for "Notes"
        doc.text("Booking", doc.getTextWidth("Important ") + 5, y - componentHeight);


        const rows = bookings.map((b) => [
            b.city,
            b.checkIn,
            b.checkOut,
            b.nights.toString(),
            b.hotelName,
        ])
        const rat = ["City", "Check In", "Check Out", "Nights", "Hotel Name"];
        y += 20;
        drawTables(doc, rat, [...rows], rows.length * 15, 20, y - componentHeight, 10, [0.3, 0.2, 0.2, 0.1, 0.2]);
        y += 10;
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
            doc.text(line, 20, y - 5);
            y += 5;
        });
    }


    const bottomMargin = 40;

    if (y > doc.internal.pageSize.height - bottomMargin) {
        doc.addPage();
        y = 20;
    }
    if (y + componentHeight > pageHeight - bottomMargin) {
        doc.addPage();
        y = 20;
    }
    doc.setFontSize(14);
    doc.setFont("Roboto", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("Important ", 14, y);
    doc.setTextColor(138, 43, 226);
    doc.text("Notes", doc.getTextWidth("Important ") + 14, y);
    const HeaderNotes = ["Point", "Details"]
    const notes = [
        ["Airlines Standard Policy", "In Case Of Visa Rejection, Visa Fees Or Any Other Non Cancellable Component Cannot Be Reimbursed At Any Cost."],
        ["Flight/Hotel Cancellation", "In Case Of Visa Rejection, Visa Fees Or Any Other Non Cancellable Component Cannot Be Reimbursed At Any Cost."],
        ["Trip Insurance", "In Case Of Visa Rejection, Visa Fees Or Any Other Non Cancellable Component Cannot Be Reimbursed At Any Cost."],
        ["Hotel Check-In & Check Out", "In Case Of Visa Rejection, Visa Fees Or Any Other Non Cancellable Component Cannot Be Reimbursed At Any Cost."],
        ["Visa Rejection", "In Case Of Visa Rejection, Visa Fees Or Any Other Non Cancellable Component Cannot Be Reimbursed At Any Cost."],
    ];
    y += 15;
    drawTables(doc, HeaderNotes, notes, notes.length * 13, 10, y, 5, [0.2, 0.8]);
    // y = renderImportantNotesSection(doc, y);

    doc.addPage();
    y = 20;
    doc.setFontSize(14);
    doc.setFont("Roboto", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("Scope Of ", 14, y + 20);
    doc.setTextColor(138, 43, 226); // Purple for "Service"
    doc.text("Service", doc.getTextWidth("Scope Of ") + 14, y + 20);
    const serviceHeader = ["Service", "Details"];
    const services = [
        ["Flight Tickets And Hotel Vouchers", "Delivered 3 Days Post Full Payment"],
        ["Web Check-In", "Boarding Pass Delivery Via Email/WhatsApp"],
        ["Support", "Chat Support – Response Time: 4 Hours"],
        ["Cancellation Support", "Provided"],
        ["Trip Support", "Response Time: 5 Minutes"],
    ];

    drawTables(doc, serviceHeader, services, services.length * 10, 10, y + 30, 10, [0.4, 0.6]);
    y += 10

    const SummaryHeader = ["category", "count ", "details", "status/comments"]
    const SummaryData = [
        ["Flight", 2, "All flights mentioned", "Awaiting  Confirmation"],
        ["Tourist Tax", 2, "Yotel (Singapore), Oakwood (Sydney), Mercure (Cairns),  Novotel(Gold Coast), Holiday Inn(Melbourne) ", "Awaiting  Confirmation"],
        ["Hotel", 2, "Airport to Hotel - Hotel to Attractions - Day trips if any", "Included"]
    ]
    if (y > doc.internal.pageSize.height - bottomMargin) {
        doc.addPage();
        y = 20;
    }

    y += 40
    doc.setFontSize(14);
    doc.setFont("Roboto", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("Inclusion ", 10, y + 70);
    doc.setTextColor(138, 43, 226); // Purple for "Notes"
    doc.text("Summary", doc.getTextWidth("Important ") + 10, y + 70);
    drawTables(doc, SummaryHeader, SummaryData, SummaryData.length * 15, 10, y + 80, 7, [0.2, 0.1, 0.4, 0.3])
    y = 20;
    doc.setFontSize(10);
    doc.setFont("Roboto", "normal")
    doc.setTextColor("black");
    doc.text("Transfer Policy(Refundable Upon Claim)", 10, y + 200);
    doc.setFontSize(10);
    doc.setTextColor("gray");

    const text = "If any transfer is delayed beyond 15 minutes, customers may book an app-based or radio taxi and claim a refund for that specific leg.";
    const wrappedText = doc.splitTextToSize(text, 180);
    doc.text(wrappedText, 10, y + 200 + 4);


    const headers1 = ["City", "Activity", "Type", "Time Required"]
    const activityData = [
        ["Rio De Janeiro", "Sydney Harbour Cruise & Taronga Zoo", "Airlines Standard", "2-3 hours"],
        ["Rio De Janeiro", "Sydney Harbour Cruise & Taronga Zoo", "Airlines Standard", "2-3 hours"],
        ["Rio De Janeiro", "Sydney Harbour Cruise & Taronga Zoo", "Airlines Standard", "2-3 hours"],
        ["Rio De Janeiro", "Sydney Harbour Cruise & Taronga Zoo", "Airlines Standard", "2-3 hours"],
        ["Rio De Janeiro", "Sydney Harbour Cruise & Taronga Zoo", "Airlines Standard", "2-3 hours"],
        ["Rio De Janeiro", "Sydney Harbour Cruise & Taronga Zoo", "Airlines Standard", "2-3 hours"],
        ["Rio De Janeiro", "Sydney Harbour Cruise & Taronga Zoo", "Airlines Standard", "2-3 hours"],
        ["Rio De Janeiro", "Sydney Harbour Cruise & Taronga Zoo", "Airlines Standard", "2-3 hours"],
        ["Rio De Janeiro", "Sydney Harbour Cruise & Taronga Zoo", "Airlines Standard", "2-3 hours"],
        ["Rio De Janeiro", "Sydney Harbour Cruise & Taronga Zoo", "Airlines Standard", "2-3 hours"],
        ["Rio De Janeiro", "Sydney Harbour Cruise & Taronga Zoo", "Airlines Standard", "2-3 hours"],
        ["Sydney", "Sydney Harbour Cruise & Taronga Zoo", "Airlines Standard", "2-3 hours"],
        ["Sydney", "Sydney Harbour Cruise & Taronga Zoo", "Airlines Standard", "2-3 hours"],
        ["Sydney", "Sydney Harbour Cruise & Taronga Zoo", "Airlines Standard", "2-3 hours"],
        ["Sydney", "Sydney Harbour Cruise & Taronga Zoo", "Airlines Standard", "2-3 hours"],
        ["Sydney", "Sydney Harbour Cruise & Taronga Zoo", "Airlines Standard", "2-3 hours"],
    ];
    if (y > doc.internal.pageSize.height - bottomMargin) {
        doc.addPage();
        y = 20;
    }
    doc.addPage();
    doc.setFontSize(14);
    doc.setFont("Roboto", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("Activity ", 14, y);
    doc.setTextColor(138, 43, 226); // Purple for "Notes"
    doc.text("Table", doc.getTextWidth("Important ") + 10, y);
    y += 10;

    drawTables(doc, headers1, activityData, activityData.length * 10, 12, y + 5, 5, [0.2, 0.4, 0.2, 0.2])
    y += 10
    doc.setFontSize(14);
    doc.setFont("Roboto", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("Terms and ", 14, y + 190);
    doc.setTextColor(138, 43, 226); // Purple for "Notes"
    doc.text(" Condition", doc.getTextWidth("Important ") + 14, y + 190);
    doc.setFontSize(12);
    doc.setFont("Roboto", "normal")
    doc.setTextColor("#2F80ED");
    doc.text("Transfer Policy(Refundable Upon Claim)", 15, y + 200);
    doc.addPage()

    //! --------------Payment Plan-----------------------
    if (flights.length > 0) {
        if (y > 180) {
            doc.addPage();
            y = 15;
        }

        doc.setFontSize(14);
        doc.setFont("Roboto", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text("Payment ", 15, y);
        doc.setTextColor(138, 43, 226); // Purple for "Notes"
        doc.text("Plan", doc.getTextWidth("Important ") + 15, y);
        y += 10;

        // const payments = [
        //     { label: "Total Amount", value: "₹ 9,00,000 For 3 Pax (Inclusive Of GST)" },
        //     { label: "TCS", value: "Not Collected" },
        // ];

        payments.map((p) => {
            if (y > 240) {
                doc.addPage();
                y = 20;
            }

            const boxX = 15;
            const boxY = y;
            const boxWidth = 180;
            const boxHeight = 15;

            // Box with border and arrow effect (optional)
            doc.setDrawColor(180);
            doc.setLineWidth(0.5);
            doc.roundedRect(boxX, boxY, boxWidth, boxHeight - 3, 2, 2);

            // Date section (left highlight)
            doc.setFillColor("#EDE9FE"); // light purple
            doc.addImage(blob, boxX, boxY, 40, boxHeight - 3, "F");

            doc.setTextColor("#000"); // date text color
            doc.setFontSize(12);
            doc.setFont("Roboto", "normal");
            doc.text(p.label || "N/A", boxX + 5, boxY + 8);

            const infoX = boxX + 45;
            doc.setFontSize(11);
            doc.setTextColor("black");
            const value = p.value || "N/A";
            doc.setFont("Roboto", "normal");
            doc.text(value, infoX, boxY + 8);

            doc.setFont("Roboto", "normal");
            doc.setFontSize(10);
            doc.setTextColor("#444");
            y += boxHeight;
        });
    }
    //!---------------------installments----------------------------------------
    // const headings = ["Installment", "Amount", "Due Date"];
    // const installments = [
    //     ["Installment 1", "₹3,50,000", "Initial Payment"],
    //     ["Installment 2", "₹4,00,000", "Post Visa Approval"],
    //     ["Installment 3", "Remaining", "20 Days Before Departure"],
    //     ["Installment 4", "Remaining", "20 Days Before Departure"],
    //     ["Installment 5", "Remaining", "20 Days Before Departure"]
    // ];

    const InstallmentsData = installments.map((ins) => [
        ins.installment,
        ins.amount,
        ins.dueDate
    ])
    // console.log(InstallmentsData)
    const InstallmentHead = ["Installment", "amount", "DueDate"];

    // Draw the dynamic table (can be placed anywhere in your PDF code)
    drawTables(doc, InstallmentHead, InstallmentsData, InstallmentsData.length * 10, 15, y + 10, 6);

    y += 100;


    if (y > 180) {
        doc.addPage();
        y = 20;
    }
    // Visa Details Title
    doc.setFontSize(14);
    doc.setFont("Roboto", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("Visa ", 15, y);
    doc.setTextColor(138, 43, 226); // Purple for "Notes"
    doc.text("Details", doc.getTextWidth("Important ") + 5, y);

    y += 6;

    //! --------------Visa Details-----------------------
    const Visalabels = ["Visa Type:", "Validity:", "Type"];
    const Visavalues = ["Tourist", "30 Days", "14/06/2025"];

    const VboxWidth = 180;
    const VboxHeight = 20;
    const VstartX = 15;
    const VnumCols = Visalabels.length;
    const VcolWidth = boxWidth / VnumCols;

    // Draw outer box
    doc.setDrawColor(180);
    doc.setLineWidth(0.5);
    doc.roundedRect(VstartX, y, VboxWidth, VboxHeight, 4, 4);

    // Loop to draw each column content
    Visalabels.forEach((label, index) => {
        const VcolStartX = VstartX + VcolWidth * index;
        const centerX = VcolStartX + VcolWidth / 2;

        // Label
        doc.setFont("Roboto", "normal");
        doc.setFontSize(10);
        doc.setTextColor(80);
        doc.text(label, centerX - 12, y + 7, { align: "left" });

        // Value
        doc.setFont("Roboto", "normal");
        doc.setFontSize(11);
        doc.setTextColor(0);
        doc.text(Visavalues[index], centerX - 12, y + 15, { align: "left" });
    });

    y += boxHeight;


    // Line Separator
    y += 20;
    doc.setDrawColor(200);
    doc.line(20, y, 190, y);
    y += 10;


    doc.setFontSize(16);
    doc.setFont("Roboto", "normal");
    doc.setTextColor(50, 0, 120);
    doc.text('PLAN.PACK.GO!', 105, y, { align: "center" });

    //!-------------------------------------------
    y += 10
    doc.addImage(Button, "PNG", 68, y, 70, 15);
    doc.setTextColor("#ffffff");
    doc.text("Book Now", 103, y + 10, { align: "center" });

    // Footer
    addFooter(doc);
    // Save PDF
    doc.save(`${name}_itinerary.pdf`);
};

export default generatePdf;




