import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import InvoiceHeader from "@/components/organisms/InvoiceHeader";
import InvoiceDetailsForm from "@/components/organisms/InvoiceDetailsForm";
import BusinessInfoForm from "@/components/organisms/BusinessInfoForm";
import ClientInfoForm from "@/components/organisms/ClientInfoForm";
import LineItemsTable from "@/components/organisms/LineItemsTable";
import InvoiceTotals from "@/components/organisms/InvoiceTotals";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { generateInvoicePDF } from "@/utils/pdfGenerator";

const InvoiceGenerator = () => {
const [formData, setFormData] = useState({
    invoiceNumber: "",
    date: "",
    dueDate: "",
    businessName: "",
    businessAddress: "",
    businessEmail: "",
    clientName: "",
    clientAddress: "",
    currency: "USD",
    template: "professional",
    logo: null,
    logoUrl: "",
    taxRate: 0,
    discountType: "percentage", // "percentage" or "fixed"
    discountValue: 0,
    paymentTerms: "",
    notes: "",
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    total: 0
  });

  const [lineItems, setLineItems] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate unique ID for line items
  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  // Update form field
  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add new line item
  const addLineItem = () => {
    const newItem = {
      id: generateId(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setLineItems(prev => [...prev, newItem]);
  };

  // Update line item
  const updateLineItem = (id, field, value) => {
    setLineItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Calculate amount when quantity or rate changes
        if (field === "quantity" || field === "rate") {
          updatedItem.amount = (updatedItem.quantity || 0) * (updatedItem.rate || 0);
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  // Remove line item
  const removeLineItem = (id) => {
    setLineItems(prev => prev.filter(item => item.id !== id));
  };

  // Calculate totals
useEffect(() => {
    const subtotal = lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    
    // Calculate discount
    let discountAmount = 0;
    if (formData.discountValue > 0) {
      if (formData.discountType === "percentage") {
        discountAmount = subtotal * (formData.discountValue / 100);
      } else {
        discountAmount = Math.min(formData.discountValue, subtotal);
      }
    }
    
    // Calculate tax on discounted amount
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * (formData.taxRate / 100);
    
    const total = taxableAmount + taxAmount;
    
    setFormData(prev => ({
      ...prev,
      subtotal,
      discountAmount,
      taxAmount,
      total
    }));
  }, [lineItems, formData.discountType, formData.discountValue, formData.taxRate]);

  // Validate form data
const validateForm = () => {
    const requiredFields = [
      { field: "invoiceNumber", label: "Invoice Number" },
      { field: "date", label: "Invoice Date" },
      { field: "dueDate", label: "Due Date" },
      { field: "businessName", label: "Business Name" },
      { field: "businessAddress", label: "Business Address" },
      { field: "businessEmail", label: "Business Email" },
      { field: "clientName", label: "Client Name" },
      { field: "clientAddress", label: "Client Address" }
    ];

    for (const { field, label } of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        toast.error(`Please fill in the ${label} field`);
        return false;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.businessEmail)) {
      toast.error("Please enter a valid business email address");
      return false;
    }

    // Validate numeric fields
    if (formData.taxRate < 0 || formData.taxRate > 100) {
      toast.error("Tax rate must be between 0 and 100 percent");
      return false;
    }

    if (formData.discountValue < 0) {
      toast.error("Discount value cannot be negative");
      return false;
    }

    if (formData.discountType === "percentage" && formData.discountValue > 100) {
      toast.error("Discount percentage cannot exceed 100%");
      return false;
    }

    if (lineItems.length === 0) {
      toast.error("Please add at least one line item");
      return false;
    }

    // Validate line items
    for (let i = 0; i < lineItems.length; i++) {
      const item = lineItems[i];
      if (!item.description || item.description.trim() === "") {
        toast.error(`Please add a description for item ${i + 1}`);
        return false;
      }
      if (!item.quantity || item.quantity <= 0) {
        toast.error(`Please enter a valid quantity for item ${i + 1}`);
        return false;
      }
      if (!item.rate || item.rate < 0) {
        toast.error(`Please enter a valid rate for item ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error("Logo file size must be less than 2MB");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload a valid image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          logo: file,
          logoUrl: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const formatCurrency = (amount) => {
    const currencyMap = {
      USD: { symbol: '$', locale: 'en-US' },
      EUR: { symbol: '€', locale: 'de-DE' },
      GBP: { symbol: '£', locale: 'en-GB' },
      CAD: { symbol: 'C$', locale: 'en-CA' },
      AUD: { symbol: 'A$', locale: 'en-AU' }
    };
    
    const currency = currencyMap[formData.currency] || currencyMap.USD;
    return new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: formData.currency,
    }).format(amount || 0);
  };

  // Generate PDF
const handleGeneratePDF = async () => {
    if (!validateForm()) {
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      generateInvoicePDF(formData, lineItems);
      toast.success("Invoice PDF generated and downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

const getTemplateStyles = (template) => {
    const styles = {
      professional: {
        bg: 'bg-white',
        accent: 'from-blue-600 to-blue-700',
        headerBg: 'bg-blue-50',
        titleColor: 'text-blue-900',
        tableHeader: 'bg-blue-50 border-blue-200',
        totalsBg: 'bg-blue-50/50',
        border: 'border-blue-200'
      },
      modern: {
        bg: 'bg-gradient-to-br from-white to-purple-50',
        accent: 'from-purple-600 to-purple-700',
        headerBg: 'bg-purple-50',
        titleColor: 'text-purple-900',
        tableHeader: 'bg-purple-50 border-purple-200',
        totalsBg: 'bg-purple-50/50',
        border: 'border-purple-200'
      },
      creative: {
        bg: 'bg-gradient-to-br from-white via-pink-50/30 to-orange-50/30',
        accent: 'from-pink-600 via-pink-500 to-orange-500',
        headerBg: 'bg-gradient-to-r from-pink-50 to-orange-50',
        titleColor: 'text-pink-900',
        tableHeader: 'bg-gradient-to-r from-pink-50 to-orange-50 border-pink-200',
        totalsBg: 'bg-gradient-to-r from-pink-50/50 to-orange-50/50',
        border: 'border-pink-200'
      },
      minimal: {
        bg: 'bg-white',
        accent: 'from-gray-700 to-gray-800',
        headerBg: 'bg-gray-50',
        titleColor: 'text-gray-900',
        tableHeader: 'bg-gray-50 border-gray-300',
        totalsBg: 'bg-gray-50',
        border: 'border-gray-300'
      }
    };
    return styles[template] || styles.professional;
  };

  const InvoicePreview = () => {
    const styles = getTemplateStyles(formData.template);
    
    return (
      <div className={`${styles.bg} border-2 ${styles.border} rounded-xl p-6 sm:p-8 shadow-xl relative overflow-hidden`}>
        {/* Template decorative elements */}
        {formData.template === 'creative' && (
          <>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-100 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-50" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-100 to-transparent rounded-full translate-y-12 -translate-x-12 opacity-50" />
          </>
        )}
        
        {formData.template === 'modern' && (
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/5 to-purple-500/10 pointer-events-none" />
        )}

        {/* Header Section */}
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-8 space-y-6 sm:space-y-0">
            <div className="flex-1">
              {formData.logoUrl && (
                <div className="mb-6">
                  <img 
                    src={formData.logoUrl} 
                    alt="Company Logo" 
                    className="h-12 sm:h-16 w-auto object-contain filter drop-shadow-sm"
                  />
                </div>
              )}
              <h1 className={`text-2xl sm:text-3xl font-bold ${styles.titleColor} mb-3 tracking-tight`}>
                {formData.businessName || "Your Business Name"}
              </h1>
              <div className="space-y-2">
                <p className="text-gray-600 text-sm sm:text-base whitespace-pre-line leading-relaxed">
                  {formData.businessAddress || "Business Address"}
                </p>
                <p className="text-gray-600 text-sm sm:text-base font-medium">
                  {formData.businessEmail || "business@email.com"}
                </p>
              </div>
            </div>
            
            <div className={`text-left sm:text-right ${styles.headerBg} p-6 rounded-xl sm:min-w-[200px] shadow-sm`}>
              <h2 className={`text-2xl sm:text-3xl font-bold ${styles.titleColor} mb-4 tracking-wide`}>
                INVOICE
              </h2>
              <div className="space-y-2 text-sm sm:text-base">
                <p className="text-gray-700 font-bold text-lg">
                  #{formData.invoiceNumber || "000001"}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Date:</span> {formData.date || "Select Date"}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Due:</span> {formData.dueDate || "Select Due Date"}
                </p>
              </div>
            </div>
          </div>

          {/* Decorative line */}
          <div className={`h-1 bg-gradient-to-r ${styles.accent} rounded-full mb-8 shadow-sm`} />
        </div>

        {/* Bill To Section */}
        <div className={`mb-8 p-6 ${styles.headerBg} rounded-xl shadow-sm`}>
          <h3 className={`font-bold ${styles.titleColor} mb-4 text-lg flex items-center`}>
            <ApperIcon name="User" className="w-5 h-5 mr-2" />
            Bill To
          </h3>
          <div className="space-y-2">
            <p className="font-bold text-gray-900 text-lg">
              {formData.clientName || "Client Name"}
            </p>
            <p className="text-gray-600 text-sm sm:text-base whitespace-pre-line leading-relaxed">
              {formData.clientAddress || "Client Address"}
            </p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-8 overflow-x-auto -mx-2 sm:mx-0 rounded-xl shadow-sm">
          <table className="w-full min-w-[500px] sm:min-w-0 bg-white rounded-xl overflow-hidden">
            <thead>
              <tr className={`${styles.tableHeader} border-b-2`}>
                <th className="text-left py-4 px-4 sm:px-6 text-sm font-bold text-gray-900 tracking-wide">DESCRIPTION</th>
                <th className="text-right py-4 px-3 text-sm font-bold text-gray-900 w-20 tracking-wide">QTY</th>
                <th className="text-right py-4 px-3 text-sm font-bold text-gray-900 w-24 tracking-wide">RATE</th>
                <th className="text-right py-4 px-4 sm:px-6 text-sm font-bold text-gray-900 w-28 tracking-wide">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.length > 0 ? lineItems.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4 sm:px-6 text-sm sm:text-base text-gray-900 font-medium">
                    {item.description || "Item description"}
                  </td>
                  <td className="text-right py-4 px-3 text-sm sm:text-base text-gray-700 font-medium">
                    {item.quantity || 0}
                  </td>
                  <td className="text-right py-4 px-3 text-sm sm:text-base text-gray-700 font-medium">
                    {formatCurrency(item.rate || 0)}
                  </td>
                  <td className="text-right py-4 px-4 sm:px-6 text-sm sm:text-base font-bold text-gray-900">
                    {formatCurrency(item.amount || 0)}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-gray-500 text-base font-medium">
                    <ApperIcon name="FileText" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No line items added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mb-8">
          <div className={`w-full sm:w-96 space-y-4 ${styles.totalsBg} p-6 rounded-xl shadow-sm border ${styles.border}`}>
            <div className="flex justify-between items-center text-base">
              <span className="text-gray-700 font-semibold">Subtotal:</span>
              <span className="font-bold text-gray-900 text-lg">{formatCurrency(formData.subtotal)}</span>
            </div>
            {formData.discountAmount > 0 && (
              <div className="flex justify-between items-center text-green-600 text-base">
                <span className="font-semibold">
                  Discount ({formData.discountType === 'percentage' 
                    ? `${formData.discountValue}%` 
                    : formatCurrency(formData.discountValue)}):
                </span>
                <span className="font-bold text-lg">-{formatCurrency(formData.discountAmount)}</span>
              </div>
            )}
            {formData.taxAmount > 0 && (
              <div className="flex justify-between items-center text-base">
                <span className="text-gray-700 font-semibold">Tax ({formData.taxRate}%):</span>
                <span className="font-bold text-gray-900 text-lg">{formatCurrency(formData.taxAmount)}</span>
              </div>
            )}
            <div className={`flex justify-between items-center font-bold text-xl border-t-2 ${styles.border} pt-4 mt-4`}>
              <span className="text-gray-900 tracking-wide">TOTAL:</span>
              <span className={`bg-gradient-to-r ${styles.accent} bg-clip-text text-transparent text-2xl`}>
                {formatCurrency(formData.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Terms and Notes */}
        {(formData.paymentTerms || formData.notes) && (
          <div className="space-y-6 border-t-2 border-gray-200 pt-8">
            {formData.paymentTerms && (
              <div className={`${styles.headerBg} p-6 rounded-xl shadow-sm`}>
                <h4 className={`font-bold ${styles.titleColor} mb-3 text-lg flex items-center`}>
                  <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
                  Payment Terms
                </h4>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{formData.paymentTerms}</p>
              </div>
            )}
            {formData.notes && (
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl shadow-sm">
                <h4 className="font-bold text-yellow-900 mb-3 text-lg flex items-center">
                  <ApperIcon name="MessageSquare" className="w-5 h-5 mr-2" />
                  Notes
                </h4>
                <p className="text-gray-700 text-sm sm:text-base whitespace-pre-line leading-relaxed">{formData.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Initialize with sample data for demo
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    
    setFormData(prev => ({
      ...prev,
      invoiceNumber: "INV-001",
      date: today,
      dueDate: nextMonth
    }));
  }, []);

  return (
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-6 sm:py-8 lg:py-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <InvoiceHeader />
        
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 lg:gap-8 xl:gap-12">
          {/* Form Section */}
          <div className="xl:col-span-3 space-y-6 lg:space-y-8">
            <InvoiceDetailsForm 
              formData={formData} 
              updateField={updateField} 
            />
            
            <BusinessInfoForm 
              formData={formData} 
              updateField={updateField}
              onLogoUpload={handleLogoUpload}
            />
            
            <ClientInfoForm 
              formData={formData} 
              updateField={updateField} 
            />
            
            <LineItemsTable
              lineItems={lineItems}
              updateLineItem={updateLineItem}
              addLineItem={addLineItem}
              removeLineItem={removeLineItem}
              currency={formData.currency}
              formatCurrency={formatCurrency}
            />
            
            <InvoiceTotals 
              formData={formData}
              updateField={updateField}
              formatCurrency={formatCurrency}
            />
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8 pb-6">
              <Button
                onClick={handleGeneratePDF}
                loading={isGenerating}
                size="xl"
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <ApperIcon name="Download" className="w-6 h-6 mr-3" />
                {isGenerating ? "Generating PDF..." : "Generate & Download PDF"}
              </Button>
            </div>
          </div>

          {/* Live Preview Section */}
          <div className="xl:col-span-2 xl:sticky xl:top-6 xl:h-screen xl:overflow-y-auto xl:pb-6">
            <div className="mb-6 bg-white/70 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/20 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 flex items-center mb-2">
                <ApperIcon name="Eye" className="w-6 h-6 mr-3 text-primary" />
                Live Preview
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                This preview shows how your invoice will appear in the PDF. Changes are reflected instantly.
              </p>
            </div>
            <div className="transform transition-all duration-300 hover:scale-[1.02]">
              <InvoicePreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;