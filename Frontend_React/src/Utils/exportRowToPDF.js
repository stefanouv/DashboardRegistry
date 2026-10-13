import jsPDF from "jspdf";

export const exportRowToPDF = (rowData, fieldLabels) => {
    if (!rowData) return;
    if (!fieldLabels) return;               // Fallback

    const doc = new jsPDF();
    let y = 20;
    const pageHeight = doc.internal.pageSize.height;
    const lineHeight = 7;
    const margin = 15;
    const paddingBetweenLabelAndValue = 8;  // Space between label and value
    const paddingTop = 5;                   // Increased spave above each field
    const paddingBottom = 0;                // No space below underline

    // Determine the maximum label width for consistent column alignment
    const allLabels = Object.keys(fieldLabels).map((key) => fieldLabels[key]);
    const maxLabelWidth = Math.max(
        ...allLabels.map((label) => doc.getTextWidth(label))
    ) + paddingBetweenLabelAndValue;

    const addField = (label, value) => {
        const displayValue =
            value === null || value === undefined ? "-" : value.toString();

        // Split value text into lines to fit within available width
        const textLines = doc.splitTextToSize(
            displayValue,
            doc.internal.pageSize.width - margin * 2 - maxLabelWidth
        );

        // Add a new page if needed
        if (y + textLines.length * lineHeight + paddingTop + paddingBottom > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }

        // Add top padding before each field
        y += paddingTop;

        // Draw label in bold
        doc.setFont("helvetica", "bold");
        doc.text(label, margin, y);

        // Draw value in normal font
        doc.setFont("helvetica", "normal");
        doc.text(textLines, margin + maxLabelWidth, y);

        // Move y position for the underline
        y += lineHeight * textLines.length + paddingBottom;

        // Draw underline seperator
        doc.setDrawColor(180);
        doc.setLineWidth(0.2);
        doc.line(margin, y, doc.internal.pageSize.width - margin, y);

        y += 3; // Small space after the line before next field
    };

    // Add fields that are visible in the table first
    Object.keys(fieldLabels).forEach((key) => {
        addField(fieldLabels[key], rowData[key]);
    });

    // Add remaining fields that are not in the table
    Object.keys(rowData)
        .filter((key) => !fieldLabels[key])
        .forEach((key) => {
            addField(key, rowData[key]);
        });

    // Save PDF
    const fileName = rowData.id || rowData.auditId
        ? `Row_${rowData.id || rowData.auditId}.pdf`
        : "ExportedRow.pdf";
    
    doc.save(fileName);
};