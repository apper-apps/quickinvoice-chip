import jsPDF from "jspdf";

export const generateInvoicePDF = (invoiceData, lineItems) => {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont("helvetica");
  
  // Header - Business Name
  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235); // Primary blue
  doc.text(invoiceData.businessName || "Your Business", 20, 30);
  
  // Invoice title
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text("INVOICE", 150, 30);
  
  // Business info
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Secondary gray
  const businessAddress = (invoiceData.businessAddress || "").split("\n");
  let yPos = 40;
  businessAddress.forEach((line) => {
    doc.text(line, 20, yPos);
    yPos += 5;
  });
  
  if (invoiceData.businessEmail) {
    doc.text(invoiceData.businessEmail, 20, yPos);
    yPos += 10;
  }
  
  // Invoice details
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Invoice #: ${invoiceData.invoiceNumber || ""}`, 150, 40);
  doc.text(`Date: ${invoiceData.date || ""}`, 150, 48);
  doc.text(`Due Date: ${invoiceData.dueDate || ""}`, 150, 56);
  
  // Bill To section
  yPos += 10;
  doc.setFontSize(12);
  doc.setTextColor(37, 99, 235);
  doc.text("BILL TO:", 20, yPos);
  
  yPos += 8;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(invoiceData.clientName || "", 20, yPos);
  
  yPos += 6;
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  const clientAddress = (invoiceData.clientAddress || "").split("\n");
  clientAddress.forEach((line) => {
    doc.text(line, 20, yPos);
    yPos += 5;
  });
  
  // Line items table
  yPos += 15;
  
  // Table header
  doc.setFillColor(248, 250, 252); // Light gray background
  doc.rect(20, yPos - 5, 170, 8, "F");
  
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99);
  doc.text("Description", 25, yPos);
  doc.text("Qty", 120, yPos);
  doc.text("Rate", 140, yPos);
  doc.text("Amount", 165, yPos);
  
  yPos += 10;
  
  // Table rows
  doc.setTextColor(0, 0, 0);
  lineItems.forEach((item, index) => {
    const description = item.description || "";
    const quantity = item.quantity || 0;
    const rate = item.rate || 0;
    const amount = item.amount || 0;
    
    // Alternate row background
    if (index % 2 === 1) {
      doc.setFillColor(249, 250, 251);
      doc.rect(20, yPos - 4, 170, 8, "F");
    }
    
    doc.text(description.substring(0, 40), 25, yPos);
    doc.text(quantity.toString(), 125, yPos);
    doc.text(`$${rate.toFixed(2)}`, 145, yPos);
    doc.text(`$${amount.toFixed(2)}`, 170, yPos);
    
    yPos += 8;
  });
  
  // Totals section
  yPos += 10;
  const subtotal = invoiceData.subtotal || 0;
  const total = invoiceData.total || 0;
  
  // Subtotal
  doc.setFontSize(10);
  doc.text("Subtotal:", 140, yPos);
  doc.text(`$${subtotal.toFixed(2)}`, 170, yPos);
  
  yPos += 8;
  
  // Total
  doc.setFontSize(12);
  doc.setTextColor(37, 99, 235);
  doc.text("TOTAL:", 140, yPos);
  doc.text(`$${total.toFixed(2)}`, 170, yPos);
  
  // Footer
  yPos += 20;
  doc.setFontSize(9);
  doc.setTextColor(156, 163, 175);
  doc.text("Thank you for your business!", 20, yPos);
  
  // Generate filename
  const invoiceNumber = invoiceData.invoiceNumber || "invoice";
  const filename = `${invoiceNumber.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`;
  
  // Save the PDF
  doc.save(filename);
};