import type { PDFDocument, TableHeadings, TableRows } from "../types/itinerary";

//!function to make a circular image data url
export function getCircularImageDataUrl(
    src: string,
    size: number,
    scale: number = 2
): Promise<string> {
    return new Promise((resolve: (value: string) => void) => {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = canvas.height = size * scale;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
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

//!function to draw custom tables in PDF
//!--------------------------------
// PDF document interface (jsPDF or similar)

export function drawTables(
    doc: PDFDocument,
    headings: TableHeadings,
    rows: TableRows,
    boxHeight: number,
    startX: number,
    startY: number,
    colRatios: number[] | null,
    bottomBoxHeight: number = 20,
    // verticalSpacing = 20,
): void {
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = startX;
    const numCols = headings.length;
    const containerWidth = pageWidth - 2 * margin;
    const colGap = 2;

    let colWidths: number[];
    if (colRatios && colRatios.length === numCols) {
        colWidths = colRatios.map(r => r * containerWidth - colGap);
    } else {
        const totalTextLength: number = headings.reduce((sum: number, h: string) => sum + h.length, 0);
        colWidths = headings.map((h: string) => (h.length / totalTextLength) * containerWidth - colGap);
    }

    const headerHeight = 25;
    const boxRadius = 5;

    // Calculate column x positions
    const colX: number[] = [];
    let currentX = margin;
    for (let i = 0; i < numCols; i++) {
        colX.push(currentX);
        currentX += colWidths[i] + colGap;
    }

    // Draw headers
    for (let i = 0; i < numCols; i++) {
        const x = colX[i];
        const colWidth = colWidths[i];

        doc.setFillColor(50, 30, 93);
        doc.roundedRect(x, startY - 5, colWidth, headerHeight, boxRadius, boxRadius, "F");

        doc.setFillColor(245, 230, 255);
        doc.rect(x, startY + headerHeight - boxRadius - 5, colWidth, boxHeight, "F");

        doc.setFillColor(245, 230, 255);
        doc.roundedRect(x, startY + headerHeight + boxHeight - 25, colWidth, bottomBoxHeight, boxRadius, boxRadius, "F");

        // Header text
        doc.setFontSize(12);
        doc.setTextColor("white");
        doc.setFont("helvetica", "bold");
        doc.text(headings[i], x + colWidth / 2, startY + 5, { align: "center" });
    }

    // Draw table rows
    let currentY = startY + headerHeight;

    doc.setFont("Roboto", "light");
    doc.setFontSize(12);
    doc.setTextColor("black");

    for (let row = 0; row < rows.length; row++) {
        let maxLinesInRow = 1;

        // First pass: calculate line breaks
        const cellLines: string[][] = rows[row].map((cell, colIndex) => {
            const text = cell !== undefined ? String(cell) : "";
            const lines = doc.splitTextToSize(text, colWidths[colIndex] - 10);
            maxLinesInRow = Math.max(maxLinesInRow, lines.length);
            return lines;
        });

        const rowHeight = maxLinesInRow * 5; // Approx 14 px per line

        // Second pass: draw text
        for (let col = 0; col < numCols; col++) {
            const x = colX[col];
            const colWidth = colWidths[col];
            const lines = cellLines[col];
            const totalHeight = lines.length * 10;

            const startYText = currentY; // padding
            const offsetY = (rowHeight - totalHeight) / 2;

            lines.forEach((line, i) => {
                doc.text(line, x + colWidth / 2, startYText + i * 5 + offsetY, { align: "center" });
            });
        }

        currentY += rowHeight; // Move to next row
    }
}






//! function to cahnge the date format from "2023-10-01" to "Sun 01 Oct'23"
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