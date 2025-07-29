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

  // Template-specific colors and styles
  const getTemplateColors = (template) => {
    const templates = {
      professional: {
        primary: [37, 99, 235],    // Blue
        secondary: [59, 130, 246], // Light blue
        accent: [219, 234, 254],   // Very light blue
        text: [30, 41, 59]         // Dark gray
      },
      modern: {
        primary: [124, 58, 237],   // Purple
        secondary: [147, 51, 234], // Light purple
        accent: [243, 232, 255],   // Very light purple
        text: [88, 28, 135]        // Dark purple
      },
      creative: {
        primary: [219, 39, 119],   // Pink
        secondary: [236, 72, 153], // Light pink
        accent: [253, 242, 248],   // Very light pink
        text: [157, 23, 77]        // Dark pink
      },
      minimal: {
        primary: [75, 85, 99],     // Gray
        secondary: [107, 114, 128], // Light gray
        accent: [249, 250, 251],   // Very light gray
        text: [17, 24, 39]         // Very dark gray
      }
    };
    return templates[template] || templates.professional;
  };

  const template = invoiceData.template || 'professional';
  const colors = getTemplateColors(template);
  
  // Set font
  doc.setFont("helvetica");
  
  let currentY = 20;
  
  // Template-specific header styling
  if (template === 'creative') {
    // Add decorative elements for creative template
    doc.setFillColor(...colors.accent);
    doc.circle(200, 10, 15, "F");
    doc.setFillColor(...colors.secondary);
    doc.circle(10, 280, 8, "F");
  }
  
  if (template === 'modern') {
    // Add gradient-like effect for modern template
    doc.setFillColor(...colors.accent);
    doc.rect(0, 0, 210, 30, "F");
  }
  
  // Add logo if available
  if (invoiceData.logoUrl) {
    try {
      const logoSize = template === 'minimal' ? [35, 18] : [45, 22];
      doc.addImage(invoiceData.logoUrl, 'JPEG', 20, currentY, ...logoSize);
      currentY += logoSize[1] + 8;
    } catch (error) {
      console.warn('Could not add logo to PDF:', error);
    }
  }
  
  // Header - Business Name with template styling
  const businessNameSize = template === 'creative' ? 28 : template === 'modern' ? 26 : 24;
  doc.setFontSize(businessNameSize);
  doc.setTextColor(...colors.primary);
  doc.text(invoiceData.businessName || "Your Business", 20, currentY + 15);
  
  // Invoice title with enhanced styling
  doc.setFontSize(template === 'minimal' ? 16 : 20);
  doc.setTextColor(...colors.text);
  const invoiceText = template === 'creative' ? '✦ INVOICE ✦' : 'INVOICE';
  doc.text(invoiceText, 150, currentY + 15);
  
  // Decorative line for non-minimal templates
  if (template !== 'minimal') {
    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(template === 'creative' ? 2 : 1);
    doc.line(20, currentY + 25, 190, currentY + 25);
  }
  
  currentY += 35;
  
  // Business info with improved spacing
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  const businessAddress = (invoiceData.businessAddress || "").split("\n");
  businessAddress.forEach((line) => {
    doc.text(line, 20, currentY);
    currentY += 5;
  });
  
  if (invoiceData.businessEmail) {
    doc.setTextColor(...colors.primary);
    doc.text(invoiceData.businessEmail, 20, currentY);
    currentY += 10;
  }
  
  // Invoice details with template-specific styling
  const detailsY = currentY - businessAddress.length * 5 - 10;
  doc.setFontSize(10);
  doc.setTextColor(...colors.text);
  
  if (template === 'creative' || template === 'modern') {
    // Add background box for invoice details
    doc.setFillColor(...colors.accent);
    doc.rect(145, detailsY - 5, 50, 25, "F");
  }
  
  doc.text(`Invoice #: ${invoiceData.invoiceNumber || ""}`, 150, detailsY);
  doc.text(`Date: ${invoiceData.date || ""}`, 150, detailsY + 8);
  doc.text(`Due Date: ${invoiceData.dueDate || ""}`, 150, detailsY + 16);
  
  // Bill To section with enhanced styling
  currentY += 15;
  doc.setFontSize(12);
  doc.setTextColor(...colors.primary);
  const billToText = template === 'creative' ? '→ BILL TO' : 'BILL TO:';
  doc.text(billToText, 20, currentY);
  
  currentY += 8;
  doc.setFontSize(11);
  doc.setTextColor(...colors.text);
  doc.text(invoiceData.clientName || "", 20, currentY);
  
  currentY += 6;
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  const clientAddress = (invoiceData.clientAddress || "").split("\n");
  clientAddress.forEach((line) => {
    doc.text(line, 20, currentY);
    currentY += 5;
  });
  
  // Line items table with template-specific styling
  currentY += 15;
  
  // Table header with enhanced design
  const headerHeight = template === 'minimal' ? 8 : 10;
  doc.setFillColor(...colors.accent);
  doc.rect(20, currentY - 5, 170, headerHeight, "F");
  
  if (template !== 'minimal') {
    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(0.5);
    doc.rect(20, currentY - 5, 170, headerHeight, "S");
  }
  
  doc.setFontSize(template === 'creative' ? 11 : 10);
  doc.setTextColor(...colors.text);
  const headers = template === 'creative' 
    ? ["✨ DESCRIPTION", "QTY", "RATE", "TOTAL"] 
    : ["DESCRIPTION", "QTY", "RATE", "AMOUNT"];
  
  doc.text(headers[0], 25, currentY);
  doc.text(headers[1], 120, currentY);
  doc.text(headers[2], 140, currentY);
  doc.text(headers[3], 165, currentY);
  
  currentY += 10;
  
  // Table rows with alternating backgrounds
  doc.setTextColor(...colors.text);
  lineItems.forEach((item, index) => {
    const description = item.description || "";
    const quantity = item.quantity || 0;
    const rate = item.rate || 0;
    const amount = item.amount || 0;
    
    // Alternate row background
    if (index % 2 === 1) {
      doc.setFillColor(249, 250, 251);
      doc.rect(20, currentY - 4, 170, 8, "F");
    }
    
    // Enhanced description handling
    const maxDescLength = template === 'minimal' ? 45 : 40;
    doc.text(description.substring(0, maxDescLength), 25, currentY);
    doc.text(quantity.toString(), 125, currentY);
    doc.text(formatCurrency(rate), 145, currentY);
    doc.text(formatCurrency(amount), 170, currentY);
    
    currentY += 8;
  });
  
  // Totals section with template-specific styling
  currentY += 15;
  
  // Enhanced totals box
  const totalsWidth = 55;
  const totalsHeight = 35 + (invoiceData.discountAmount > 0 ? 8 : 0) + (invoiceData.taxAmount > 0 ? 8 : 0);
  
  if (template !== 'minimal') {
    doc.setFillColor(...colors.accent);
    doc.rect(190 - totalsWidth, currentY - 5, totalsWidth, totalsHeight, "F");
    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(0.5);
    doc.rect(190 - totalsWidth, currentY - 5, totalsWidth, totalsHeight, "S");
  }
  
  doc.setFontSize(10);
  doc.setTextColor(...colors.text);
  
  // Subtotal
  doc.text("Subtotal:", 140, currentY);
  doc.text(formatCurrency(invoiceData.subtotal), 175, currentY);
  currentY += 8;
  
  // Discount
  if (invoiceData.discountAmount > 0) {
    doc.setTextColor(34, 197, 94);
    const discountLabel = invoiceData.discountType === 'percentage' 
      ? `Discount (${invoiceData.discountValue}%):`
      : `Discount:`;
    doc.text(discountLabel, 140, currentY);
    doc.text(`-${formatCurrency(invoiceData.discountAmount)}`, 175, currentY);
    currentY += 8;
    doc.setTextColor(...colors.text);
  }
  
  // Tax
  if (invoiceData.taxAmount > 0) {
    doc.text(`Tax (${invoiceData.taxRate}%):`, 140, currentY);
    doc.text(formatCurrency(invoiceData.taxAmount), 175, currentY);
    currentY += 8;
  }
  
  // Total with enhanced styling
  doc.setFontSize(template === 'creative' ? 14 : 12);
  doc.setTextColor(...colors.primary);
  const totalLabel = template === 'creative' ? '★ TOTAL:' : 'TOTAL:';
  doc.text(totalLabel, 140, currentY);
  doc.text(formatCurrency(invoiceData.total), 175, currentY);
  
  // Decorative line above total for some templates
  if (template === 'professional' || template === 'modern') {
    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(1);
    doc.line(140, currentY - 3, 185, currentY - 3);
  }
  
  // Footer section
  currentY += 25;
  
  // Payment Terms and Notes with template styling
  doc.setFontSize(9);
  doc.setTextColor(...colors.text);
  
  if (invoiceData.paymentTerms) {
    doc.setFontSize(10);
    doc.setTextColor(...colors.primary);
    const termsLabel = template === 'creative' ? '💳 Payment Terms:' : 'Payment Terms:';
    doc.text(termsLabel, 20, currentY);
    currentY += 6;
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(invoiceData.paymentTerms, 20, currentY);
    currentY += 12;
  }
  
  if (invoiceData.notes) {
    doc.setFontSize(10);
    doc.setTextColor(...colors.primary);
    const notesLabel = template === 'creative' ? '📝 Notes:' : 'Notes:';
    doc.text(notesLabel, 20, currentY);
    currentY += 6;
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    const noteLines = doc.splitTextToSize(invoiceData.notes, 170);
    doc.text(noteLines, 20, currentY);
    currentY += noteLines.length * 4;
  }
  
  // Footer message with template-specific styling
  currentY += 10;
  doc.setFontSize(9);
  doc.setTextColor(156, 163, 175);
  const footerMsg = template === 'creative' 
    ? '✨ Thank you for your business! ✨' 
    : 'Thank you for your business!';
  doc.text(footerMsg, 20, currentY);
  
  // Generate filename
  const invoiceNumber = invoiceData.invoiceNumber || "invoice";
  const templatePrefix = template !== 'professional' ? `${template}_` : '';
  const filename = `${templatePrefix}${invoiceNumber.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`;
  
  // Save the PDF
  doc.save(filename);
};