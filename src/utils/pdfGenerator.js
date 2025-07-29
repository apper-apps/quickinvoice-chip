import jsPDF from "jspdf";

export const generateInvoicePDF = (invoiceData, lineItems) => {
  const doc = new jsPDF();
const formatCurrency = (amount) => {
    const currencyMap = {
      USD: { symbol: '$', locale: 'en-US' },
      EUR: { symbol: '€', locale: 'de-DE' },
      GBP: { symbol: '£', locale: 'en-GB' },
      CAD: { symbol: 'C$', locale: 'en-CA' },
      AUD: { symbol: 'A$', locale: 'en-AU' }
    };
    
    const currency = currencyMap[invoiceData.currency] || currencyMap.USD;
    return new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: invoiceData.currency || 'USD',
    }).format(amount || 0);
  };
  // Set font
  doc.setFont("helvetica");
  
let yPos = 20;
  
  // Add logo if available
  if (invoiceData.logoUrl) {
    try {
      doc.addImage(invoiceData.logoUrl, 'JPEG', 20, yPos, 40, 20);
      yPos += 25;
    } catch (error) {
      console.warn('Could not add logo to PDF:', error);
    }
  }
  
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
  yPos = 40;
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
  
  // Totals section
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  // Subtotal
  doc.text("Subtotal:", 140, yPos);
  doc.text(formatCurrency(invoiceData.subtotal), 170, yPos);
  yPos += 8;
  
  // Discount
  if (invoiceData.discountAmount > 0) {
    doc.setTextColor(34, 197, 94); // Green color
    const discountLabel = invoiceData.discountType === 'percentage' 
      ? `Discount (${invoiceData.discountValue}%):`
      : `Discount (${formatCurrency(invoiceData.discountValue)}):`;
    doc.text(discountLabel, 140, yPos);
    doc.text(`-${formatCurrency(invoiceData.discountAmount)}`, 170, yPos);
    yPos += 8;
    doc.setTextColor(0, 0, 0);
  }
  
  // Tax
  if (invoiceData.taxAmount > 0) {
    doc.text(`Tax (${invoiceData.taxRate}%):`, 140, yPos);
    doc.text(formatCurrency(invoiceData.taxAmount), 170, yPos);
    yPos += 8;
  }
  
  // Total
  doc.setFontSize(12);
  doc.setTextColor(37, 99, 235);
  doc.text("TOTAL:", 140, yPos);
  doc.text(formatCurrency(invoiceData.total), 170, yPos);
  
  // Footer
yPos += 20;
  
  // Payment Terms and Notes
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  
  if (invoiceData.paymentTerms) {
    doc.setFontSize(10);
    doc.text("Payment Terms:", 20, yPos);
    yPos += 6;
    doc.setFontSize(9);
    doc.text(invoiceData.paymentTerms, 20, yPos);
    yPos += 10;
  }
  
  if (invoiceData.notes) {
    doc.setFontSize(10);
    doc.text("Notes:", 20, yPos);
    yPos += 6;
    doc.setFontSize(9);
    const noteLines = doc.splitTextToSize(invoiceData.notes, 170);
    doc.text(noteLines, 20, yPos);
    yPos += noteLines.length * 4;
  }
  
  doc.setFontSize(9);
  doc.setTextColor(156, 163, 175);
  doc.text("Thank you for your business!", 20, yPos);
  
  // Generate filename
  const invoiceNumber = invoiceData.invoiceNumber || "invoice";
  const filename = `${invoiceNumber.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`;
// Save the PDF
  doc.save(filename);
};