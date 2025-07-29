import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import InvoiceTotals from "@/components/organisms/InvoiceTotals";
import BusinessInfoForm from "@/components/organisms/BusinessInfoForm";
import InvoiceHeader from "@/components/organisms/InvoiceHeader";
import InvoiceDetailsForm from "@/components/organisms/InvoiceDetailsForm";
import LineItemsTable from "@/components/organisms/LineItemsTable";
import ClientInfoForm from "@/components/organisms/ClientInfoForm";
import Button from "@/components/atoms/Button";
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
      },
      corporate: {
        bg: 'bg-gradient-to-br from-slate-900 to-slate-800',
        accent: 'from-slate-600 to-slate-700',
        headerBg: 'bg-slate-800/50',
        titleColor: 'text-slate-100',
        tableHeader: 'bg-slate-800/30 border-slate-600',
        totalsBg: 'bg-slate-800/20',
        border: 'border-slate-600'
      },
      elegant: {
        bg: 'bg-gradient-to-br from-white via-rose-50/20 to-amber-50/20',
        accent: 'from-rose-600 via-rose-500 to-amber-500',
        headerBg: 'bg-gradient-to-r from-rose-50/50 to-amber-50/50',
        titleColor: 'text-rose-900',
        tableHeader: 'bg-gradient-to-r from-rose-50/30 to-amber-50/30 border-rose-200',
        totalsBg: 'bg-gradient-to-r from-rose-50/40 to-amber-50/40',
        border: 'border-rose-200'
      },
      tech: {
        bg: 'bg-gradient-to-br from-slate-50 to-cyan-50',
        accent: 'from-cyan-600 to-teal-600',
        headerBg: 'bg-gradient-to-r from-cyan-50 to-teal-50',
        titleColor: 'text-cyan-900',
        tableHeader: 'bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-200',
        totalsBg: 'bg-gradient-to-r from-cyan-50/50 to-teal-50/50',
        border: 'border-cyan-200'
      },
      classic: {
        bg: 'bg-gradient-to-br from-white to-amber-50/30',
        accent: 'from-amber-700 to-amber-800',
        headerBg: 'bg-amber-50/50',
        titleColor: 'text-amber-900',
        tableHeader: 'bg-amber-50/30 border-amber-300',
        totalsBg: 'bg-amber-50/40',
        border: 'border-amber-300'
      }
    };
    return styles[template] || styles.professional;
  };
  const InvoicePreview = () => {
    const styles = getTemplateStyles(formData.template);
    
    return (
<div className={`${styles.bg} border-2 ${styles.border} shadow-xl relative overflow-hidden ${
        formData.template === 'minimal' ? 'rounded-none' : 
        formData.template === 'creative' ? 'rounded-3xl' :
        formData.template === 'tech' ? 'rounded-sm' :
        'rounded-xl'
      } ${
        formData.template === 'professional' ? 'p-8 sm:p-12' :
        formData.template === 'minimal' ? 'p-12 sm:p-16' :
        formData.template === 'corporate' ? 'p-6 sm:p-8' :
        'p-6 sm:p-10'
      }`}>
        
        {/* Template-specific decorative elements */}
        {formData.template === 'creative' && (
          <>
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-pink-100 via-purple-50 to-transparent rounded-full -translate-y-20 translate-x-20 opacity-60" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-100 via-red-50 to-transparent rounded-full translate-y-16 -translate-x-16 opacity-60" />
            <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-pink-200 rounded-full opacity-30" />
            <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-purple-200 rounded-full opacity-40" />
          </>
        )}
        
        {formData.template === 'modern' && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/5 to-purple-500/10 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-100 transform rotate-45 translate-x-12 translate-y-12 opacity-50" />
          </>
        )}

        {formData.template === 'tech' && (
          <>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400" />
            <div className="absolute top-4 right-4 w-16 h-16 border-2 border-cyan-200 transform rotate-45 opacity-30" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border border-teal-200 opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-50/20 via-transparent to-teal-50/20 pointer-events-none" />
          </>
        )}

        {formData.template === 'corporate' && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/5 via-transparent to-slate-900/10 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-4 bg-slate-800" />
            <div className="absolute top-4 left-0 w-full h-px bg-slate-600" />
          </>
        )}

        {formData.template === 'elegant' && (
          <>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
            <div className="absolute top-6 right-6 w-8 h-8 border border-rose-200 rounded-full opacity-40" />
            <div className="absolute bottom-6 left-6 w-6 h-6 border border-rose-200 rounded-full opacity-30" />
          </>
        )}

        {formData.template === 'classic' && (
          <>
            <div className="absolute inset-0 border-4 border-amber-100 pointer-events-none m-4" />
            <div className="absolute top-8 left-8 w-4 h-4 border-2 border-amber-300 transform rotate-45" />
            <div className="absolute top-8 right-8 w-4 h-4 border-2 border-amber-300 transform rotate-45" />
            <div className="absolute bottom-8 left-8 w-4 h-4 border-2 border-amber-300 transform rotate-45" />
            <div className="absolute bottom-8 right-8 w-4 h-4 border-2 border-amber-300 transform rotate-45" />
          </>
        )}

        {/* Header Section - Template-specific layouts */}
        <div className="relative">
          {/* Professional Template - Traditional layout */}
          {formData.template === 'professional' && (
            <div className="mb-12">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-8 lg:space-y-0">
                <div className="flex-1 space-y-6">
                  {formData.logoUrl && (
                    <div className="mb-8">
                      <img 
                        src={formData.logoUrl} 
                        alt="Company Logo" 
                        className="h-16 w-auto object-contain filter drop-shadow-sm"
                      />
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                      {formData.businessName || "Your Business"}
                    </h1>
                    <div className="text-gray-600 space-y-1 leading-relaxed">
                      {formData.businessAddress?.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                      {formData.businessEmail && (
                        <p className="font-medium text-blue-600 mt-2">{formData.businessEmail}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="lg:text-right">
                  <h2 className="text-4xl font-bold text-blue-900 mb-6 tracking-wider">
                    INVOICE
                  </h2>
                  <div className="space-y-3 text-base">
                    <p className="text-gray-900 font-bold text-xl">
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
              <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mt-8" />
            </div>
          )}

          {/* Modern Template - Geometric layout */}
          {formData.template === 'modern' && (
            <div className="mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center space-x-6">
                    {formData.logoUrl && (
                      <div className="w-20 h-20 bg-white rounded-lg shadow-lg p-2 flex items-center justify-center">
                        <img 
                          src={formData.logoUrl} 
                          alt="Company Logo" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {formData.businessName || "Your Business"}
                      </h1>
                      <div className="text-gray-600 text-sm space-y-1">
                        {formData.businessAddress?.split('\n').map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                        {formData.businessEmail && (
                          <p className="font-medium text-purple-600">{formData.businessEmail}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
                  <h2 className="text-3xl font-bold text-purple-900 mb-4 text-center transform -skew-x-6">
                    INVOICE
                  </h2>
                  <div className="space-y-2 text-center">
                    <p className="text-purple-900 font-bold text-lg">
                      #{formData.invoiceNumber || "000001"}
                    </p>
                    <div className="text-gray-700 text-sm space-y-1">
                      <p><span className="font-semibold">Date:</span> {formData.date || "Select Date"}</p>
                      <p><span className="font-semibold">Due:</span> {formData.dueDate || "Select Due Date"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Creative Template - Artistic layout */}
          {formData.template === 'creative' && (
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 tracking-wide">
                  ✨ INVOICE ✨
                </h2>
                <p className="text-xl font-bold text-pink-900">
                  #{formData.invoiceNumber || "000001"}
                </p>
              </div>
              
              <div className="flex flex-col lg:flex-row lg:justify-between items-center space-y-8 lg:space-y-0">
                <div className="text-center lg:text-left">
                  {formData.logoUrl && (
                    <div className="mb-6 flex justify-center lg:justify-start">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 p-3 shadow-lg">
                        <img 
                          src={formData.logoUrl} 
                          alt="Company Logo" 
                          className="w-full h-full object-contain rounded-full"
                        />
                      </div>
                    </div>
                  )}
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    {formData.businessName || "Your Business"}
                  </h1>
                  <div className="text-gray-600 space-y-1">
                    {formData.businessAddress?.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                    {formData.businessEmail && (
                      <p className="font-medium text-pink-600">{formData.businessEmail}</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-8 rounded-3xl border-2 border-pink-200 shadow-lg">
                  <div className="text-center space-y-3">
                    <p className="text-gray-700">
                      <span className="font-semibold">Date:</span> {formData.date || "Select Date"}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Due:</span> {formData.dueDate || "Select Due Date"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Minimal Template - Ultra clean layout */}
          {formData.template === 'minimal' && (
            <div className="mb-16">
              <div className="flex flex-col space-y-12">
                <div className="flex justify-between items-start">
                  <div className="space-y-8">
                    {formData.logoUrl && (
                      <div>
                        <img 
                          src={formData.logoUrl} 
                          alt="Company Logo" 
                          className="h-12 w-auto object-contain"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <h1 className="text-lg font-medium text-gray-900">
                        {formData.businessName || "Your Business"}
                      </h1>
                      <div className="text-gray-500 text-sm space-y-0.5">
                        {formData.businessAddress?.split('\n').map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                        {formData.businessEmail && (
                          <p className="text-gray-700">{formData.businessEmail}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-6">
                    <h2 className="text-2xl font-light text-gray-900 tracking-widest">
                      INVOICE
                    </h2>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-900 font-medium">
                        {formData.invoiceNumber || "000001"}
                      </p>
                      <div className="space-y-1 text-gray-500">
                        <p>{formData.date || "Select Date"}</p>
                        <p>Due: {formData.dueDate || "Select Due Date"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="h-px bg-gray-200" />
              </div>
            </div>
          )}

          {/* Corporate Template - Bold professional layout */}
          {formData.template === 'corporate' && (
            <div className="mb-10">
              <div className="bg-slate-800 text-white p-6 -mx-6 -mt-6 mb-8">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-4">
                    {formData.logoUrl && (
                      <div className="w-16 h-16 bg-white rounded p-2">
                        <img 
                          src={formData.logoUrl} 
                          alt="Company Logo" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <h1 className="text-xl font-bold">
                        {formData.businessName || "Your Business"}
                      </h1>
                      <p className="text-slate-300 text-sm">
                        {formData.businessEmail || "business@company.com"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <h2 className="text-3xl font-bold tracking-wider mb-2">
                      INVOICE
                    </h2>
                    <p className="text-slate-100 font-bold text-lg">
                      #{formData.invoiceNumber || "000001"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="text-gray-600 space-y-1">
                    {formData.businessAddress?.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-gray-700">
                    <span className="font-semibold">Date:</span> {formData.date || "Select Date"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Due:</span> {formData.dueDate || "Select Due Date"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Elegant Template - Refined layout */}
          {formData.template === 'elegant' && (
            <div className="mb-12">
              <div className="text-center mb-10">
                <div className="flex justify-center items-center space-x-4 mb-6">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-rose-300"></div>
                  <h2 className="text-3xl font-light text-rose-900 tracking-widest">
                    INVOICE
                  </h2>
                  <div className="w-12 h-px bg-gradient-to-l from-transparent to-rose-300"></div>
                </div>
                <p className="text-rose-800 font-semibold text-lg">
                  № {formData.invoiceNumber || "000001"}
                </p>
              </div>
              
              <div className="flex flex-col lg:flex-row lg:justify-between space-y-8 lg:space-y-0">
                <div className="text-center lg:text-left">
                  {formData.logoUrl && (
                    <div className="mb-6 flex justify-center lg:justify-start">
                      <div className="relative">
                        <img 
                          src={formData.logoUrl} 
                          alt="Company Logo" 
                          className="h-16 w-auto object-contain"
                        />
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-px bg-rose-300"></div>
                      </div>
                    </div>
                  )}
                  <h1 className="text-xl font-medium text-gray-900 mb-4">
                    {formData.businessName || "Your Business"}
                  </h1>
                  <div className="text-gray-600 space-y-1 text-sm">
                    {formData.businessAddress?.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                    {formData.businessEmail && (
                      <p className="font-medium text-rose-600 mt-2">{formData.businessEmail}</p>
                    )}
                  </div>
                </div>
                
                <div className="text-center lg:text-right space-y-3">
                  <div className="inline-block bg-gradient-to-r from-rose-50 to-pink-50 px-6 py-4 rounded-lg border border-rose-200">
                    <p className="text-gray-700 text-sm mb-1">
                      <span className="font-medium">Date:</span> {formData.date || "Select Date"}
                    </p>
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium">Due:</span> {formData.dueDate || "Select Due Date"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tech Template - Modern tech layout */}
          {formData.template === 'tech' && (
            <div className="mb-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8">
                  <div className="flex items-start space-x-6">
                    {formData.logoUrl && (
                      <div className="w-20 h-20 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg p-3 shadow-lg border border-cyan-200">
                        <img 
                          src={formData.logoUrl} 
                          alt="Company Logo" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                        {formData.businessName || "Your Business"}
                      </h1>
                      <div className="text-gray-600 text-sm space-y-1 font-mono">
                        {formData.businessAddress?.split('\n').map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                        {formData.businessEmail && (
                          <p className="font-medium text-cyan-600">{formData.businessEmail}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-4">
                  <div className="bg-gradient-to-br from-cyan-900 to-blue-900 text-white p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4 tracking-widest font-mono">
                      &lt;INVOICE/&gt;
                    </h2>
                    <div className="space-y-2 font-mono text-sm">
                      <p className="text-cyan-200">
                        ID: <span className="text-white font-bold">#{formData.invoiceNumber || "000001"}</span>
                      </p>
                      <p className="text-cyan-200">
                        DATE: <span className="text-white">{formData.date || "Select Date"}</span>
                      </p>
                      <p className="text-cyan-200">
                        DUE: <span className="text-white">{formData.dueDate || "Select Due Date"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Classic Template - Traditional formal layout */}
          {formData.template === 'classic' && (
            <div className="mb-12">
              <div className="text-center mb-8 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-px bg-amber-400"></div>
                <h2 className="text-4xl font-serif font-bold text-amber-900 mb-4 mt-6 tracking-wide">
                  INVOICE
                </h2>
                <div className="flex justify-center items-center space-x-3 mb-4">
                  <div className="w-8 h-px bg-amber-400"></div>
                  <p className="text-amber-800 font-bold text-xl">
                    {formData.invoiceNumber || "000001"}
                  </p>
                  <div className="w-8 h-px bg-amber-400"></div>
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-px bg-amber-400"></div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  {formData.logoUrl && (
                    <div className="text-center lg:text-left">
                      <div className="inline-block border-2 border-amber-300 p-4 rounded">
                        <img 
                          src={formData.logoUrl} 
                          alt="Company Logo" 
                          className="h-16 w-auto object-contain"
                        />
                      </div>
                    </div>
                  )}
                  <div className="text-center lg:text-left">
                    <h1 className="text-xl font-serif font-bold text-gray-900 mb-3">
                      {formData.businessName || "Your Business"}
                    </h1>
                    <div className="text-gray-600 space-y-1">
                      {formData.businessAddress?.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                      {formData.businessEmail && (
                        <p className="font-medium text-amber-700 mt-2">{formData.businessEmail}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-center lg:text-right space-y-4">
                  <div className="inline-block border border-amber-300 bg-amber-50 px-6 py-4">
                    <div className="space-y-2">
                      <p className="text-gray-700 font-serif">
                        <span className="font-semibold">Date:</span> {formData.date || "Select Date"}
                      </p>
                      <p className="text-gray-700 font-serif">
                        <span className="font-semibold">Due:</span> {formData.dueDate || "Select Due Date"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bill To Section - Template-specific styling */}
        <div className={`mb-8 ${
          formData.template === 'minimal' ? 'border-b border-gray-200 pb-6' :
          formData.template === 'tech' ? 'bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg border border-cyan-200' :
          formData.template === 'corporate' ? 'bg-slate-100 p-6 rounded' :
          formData.template === 'creative' ? 'bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 p-6 rounded-2xl border-2 border-pink-200' :
          formData.template === 'elegant' ? 'bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-lg border border-rose-200' :
          formData.template === 'classic' ? 'border-2 border-amber-300 bg-amber-50/30 p-6' :
          `p-6 ${styles.headerBg} rounded-xl shadow-sm`
        }`}>
          <h3 className={`font-bold mb-4 text-lg flex items-center ${
            formData.template === 'minimal' ? 'text-gray-900 font-light text-sm uppercase tracking-widest' :
            formData.template === 'tech' ? 'text-cyan-900 font-mono' :
            formData.template === 'corporate' ? 'text-slate-800 text-xl' :
            formData.template === 'creative' ? 'text-pink-900' :
            formData.template === 'elegant' ? 'text-rose-900 font-light' :
            formData.template === 'classic' ? 'text-amber-900 font-serif' :
            styles.titleColor
          }`}>
            {formData.template !== 'minimal' && (
              <ApperIcon name="User" className="w-5 h-5 mr-2" />
            )}
            {formData.template === 'tech' ? '→ BILL_TO:' :
             formData.template === 'creative' ? '💌 Bill To' :
             formData.template === 'elegant' ? 'Bill To' :
             formData.template === 'classic' ? 'BILL TO' :
             'Bill To'}
          </h3>
          <div className="space-y-2">
            <p className={`font-bold text-lg ${
              formData.template === 'minimal' ? 'text-gray-900 font-medium' :
              formData.template === 'tech' ? 'text-cyan-900 font-mono' :
              'text-gray-900'
            }`}>
              {formData.clientName || "Client Name"}
            </p>
            <p className={`text-sm sm:text-base whitespace-pre-line leading-relaxed ${
              formData.template === 'minimal' ? 'text-gray-500' :
              formData.template === 'tech' ? 'text-gray-700 font-mono text-sm' :
              'text-gray-600'
            }`}>
              {formData.clientAddress || "Client Address"}
            </p>
          </div>
        </div>

        {/* Line Items Table - Template-specific styling */}
        <div className={`mb-8 overflow-x-auto -mx-2 sm:mx-0 ${
          formData.template === 'minimal' ? '' :
          formData.template === 'tech' ? 'rounded-lg' :
          formData.template === 'creative' ? 'rounded-2xl' :
          'rounded-xl shadow-sm'
        }`}>
          <table className={`w-full min-w-[500px] sm:min-w-0 ${
            formData.template === 'minimal' ? 'bg-transparent' :
            formData.template === 'corporate' ? 'bg-white border-2 border-slate-200' :
            formData.template === 'tech' ? 'bg-gradient-to-br from-white to-cyan-50' :
            'bg-white rounded-xl overflow-hidden'
          }`}>
            <thead>
              <tr className={`${
                formData.template === 'minimal' ? 'border-b border-gray-200' :
                formData.template === 'tech' ? 'bg-gradient-to-r from-cyan-800 to-blue-800 text-white' :
                formData.template === 'corporate' ? 'bg-slate-800 text-white' :
                formData.template === 'creative' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' :
                formData.template === 'elegant' ? 'bg-gradient-to-r from-rose-100 to-pink-100 border-b-2 border-rose-200' :
                formData.template === 'classic' ? 'bg-amber-100 border-b-2 border-amber-300' :
                `${styles.tableHeader} border-b-2`
              }`}>
                <th className={`text-left py-4 px-4 sm:px-6 text-sm font-bold tracking-wide ${
                  formData.template === 'minimal' ? 'text-gray-500 font-light uppercase text-xs' :
                  formData.template === 'tech' ? 'font-mono' :
                  formData.template === 'classic' ? 'font-serif text-amber-900' :
                  formData.template === 'corporate' || formData.template === 'tech' || formData.template === 'creative' ? 'text-white' :
                  'text-gray-900'
                }`}>
                  {formData.template === 'tech' ? '// DESCRIPTION' :
                   formData.template === 'creative' ? '✨ DESCRIPTION' :
                   'DESCRIPTION'}
                </th>
                <th className={`text-right py-4 px-3 text-sm font-bold w-20 tracking-wide ${
                  formData.template === 'minimal' ? 'text-gray-500 font-light uppercase text-xs' :
                  formData.template === 'tech' ? 'font-mono' :
                  formData.template === 'classic' ? 'font-serif text-amber-900' :
                  formData.template === 'corporate' || formData.template === 'tech' || formData.template === 'creative' ? 'text-white' :
                  'text-gray-900'
                }`}>QTY</th>
                <th className={`text-right py-4 px-3 text-sm font-bold w-24 tracking-wide ${
                  formData.template === 'minimal' ? 'text-gray-500 font-light uppercase text-xs' :
                  formData.template === 'tech' ? 'font-mono' :
                  formData.template === 'classic' ? 'font-serif text-amber-900' :
                  formData.template === 'corporate' || formData.template === 'tech' || formData.template === 'creative' ? 'text-white' :
                  'text-gray-900'
                }`}>RATE</th>
                <th className={`text-right py-4 px-4 sm:px-6 text-sm font-bold w-28 tracking-wide ${
                  formData.template === 'minimal' ? 'text-gray-500 font-light uppercase text-xs' :
                  formData.template === 'tech' ? 'font-mono' :
                  formData.template === 'classic' ? 'font-serif text-amber-900' :
                  formData.template === 'corporate' || formData.template === 'tech' || formData.template === 'creative' ? 'text-white' :
                  'text-gray-900'
                }`}>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.length > 0 ? lineItems.map((item, index) => (
                <tr key={index} className={`${
                  formData.template === 'minimal' ? 'border-b border-gray-100' :
                  formData.template === 'tech' ? 'border-b border-cyan-100 hover:bg-cyan-50/50' :
                  formData.template === 'corporate' ? 'border-b border-slate-100 hover:bg-slate-50' :
                  formData.template === 'creative' ? 'border-b border-pink-100 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50' :
                  formData.template === 'elegant' ? 'border-b border-rose-100 hover:bg-rose-50/30' :
                  formData.template === 'classic' ? 'border-b border-amber-100 hover:bg-amber-50/30' :
                  'border-b border-gray-100 hover:bg-gray-50/50'
                } transition-colors`}>
                  <td className={`py-4 px-4 sm:px-6 text-sm sm:text-base font-medium ${
                    formData.template === 'tech' ? 'text-gray-900 font-mono text-sm' :
                    formData.template === 'minimal' ? 'text-gray-900 font-light' :
                    'text-gray-900'
                  }`}>
                    {item.description || "Item description"}
                  </td>
                  <td className={`text-right py-4 px-3 text-sm sm:text-base font-medium ${
                    formData.template === 'tech' ? 'text-gray-700 font-mono' :
                    formData.template === 'minimal' ? 'text-gray-700 font-light' :
                    'text-gray-700'
                  }`}>
                    {item.quantity || 0}
                  </td>
                  <td className={`text-right py-4 px-3 text-sm sm:text-base font-medium ${
                    formData.template === 'tech' ? 'text-gray-700 font-mono' :
                    formData.template === 'minimal' ? 'text-gray-700 font-light' :
                    'text-gray-700'
                  }`}>
                    {formatCurrency(item.rate || 0)}
                  </td>
                  <td className={`text-right py-4 px-4 sm:px-6 text-sm sm:text-base font-bold ${
                    formData.template === 'tech' ? 'text-gray-900 font-mono' :
                    formData.template === 'minimal' ? 'text-gray-900 font-medium' :
                    'text-gray-900'
                  }`}>
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

        {/* Totals Section - Template-specific styling */}
        <div className="flex justify-end mb-8">
          <div className={`w-full sm:w-96 space-y-4 p-6 ${
            formData.template === 'minimal' ? 'border-t border-gray-200 bg-transparent pt-8' :
            formData.template === 'tech' ? 'bg-gradient-to-br from-cyan-900 to-blue-900 text-white rounded-lg' :
            formData.template === 'corporate' ? 'bg-slate-800 text-white rounded' :
            formData.template === 'creative' ? 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-2xl border-2 border-pink-200' :
            formData.template === 'elegant' ? 'bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg border border-rose-200' :
            formData.template === 'classic' ? 'bg-amber-50 border-2 border-amber-300 rounded' :
            `${styles.totalsBg} rounded-xl shadow-sm border ${styles.border}`
          }`}>
            <div className={`flex justify-between items-center text-base ${
              formData.template === 'tech' || formData.template === 'corporate' ? 'text-gray-200' : ''
            }`}>
              <span className={`font-semibold ${
                formData.template === 'minimal' ? 'text-gray-500 font-light' :
                formData.template === 'tech' ? 'text-cyan-200 font-mono' :
                formData.template === 'corporate' ? 'text-gray-200' :
                formData.template === 'classic' ? 'font-serif text-amber-900' :
                'text-gray-700'
              }`}>Subtotal:</span>
              <span className={`font-bold text-lg ${
                formData.template === 'minimal' ? 'text-gray-900 font-medium' :
                formData.template === 'tech' ? 'text-white font-mono' :
                formData.template === 'corporate' ? 'text-white' :
                'text-gray-900'
              }`}>{formatCurrency(formData.subtotal)}</span>
            </div>
            {formData.discountAmount > 0 && (
              <div className={`flex justify-between items-center text-base ${
                formData.template === 'tech' || formData.template === 'corporate' ? 'text-green-300' : 'text-green-600'
              }`}>
                <span className={`font-semibold ${
                  formData.template === 'tech' ? 'font-mono' :
                  formData.template === 'classic' ? 'font-serif' : ''
                }`}>
                  Discount ({formData.discountType === 'percentage' 
                    ? `${formData.discountValue}%` 
                    : formatCurrency(formData.discountValue)}):
                </span>
                <span className={`font-bold text-lg ${
                  formData.template === 'tech' ? 'font-mono' : ''
                }`}>-{formatCurrency(formData.discountAmount)}</span>
              </div>
            )}
            {formData.taxAmount > 0 && (
              <div className={`flex justify-between items-center text-base ${
                formData.template === 'tech' || formData.template === 'corporate' ? 'text-gray-200' : ''
              }`}>
                <span className={`font-semibold ${
                  formData.template === 'minimal' ? 'text-gray-500 font-light' :
                  formData.template === 'tech' ? 'text-cyan-200 font-mono' :
                  formData.template === 'corporate' ? 'text-gray-200' :
                  formData.template === 'classic' ? 'font-serif text-amber-900' :
                  'text-gray-700'
                }`}>Tax ({formData.taxRate}%):</span>
                <span className={`font-bold text-lg ${
                  formData.template === 'minimal' ? 'text-gray-900 font-medium' :
                  formData.template === 'tech' ? 'text-white font-mono' :
                  formData.template === 'corporate' ? 'text-white' :
                  'text-gray-900'
                }`}>{formatCurrency(formData.taxAmount)}</span>
              </div>
            )}
            <div className={`pt-4 flex justify-between items-center ${
              formData.template === 'minimal' ? 'border-t border-gray-200' :
              formData.template === 'tech' ? 'border-t border-cyan-400' :
              formData.template === 'corporate' ? 'border-t border-slate-400' :
              formData.template === 'creative' ? 'border-t-2 border-pink-300' :
              formData.template === 'elegant' ? 'border-t border-rose-300' :
              formData.template === 'classic' ? 'border-t-2 border-amber-400' :
              'border-t-2 border-gray-300'
            }`}>
              <span className={`tracking-wide ${
                formData.template === 'minimal' ? 'text-gray-900 font-light text-lg' :
                formData.template === 'tech' ? 'text-cyan-100 font-mono font-bold' :
                formData.template === 'corporate' ? 'text-white font-bold text-lg' :
                formData.template === 'creative' ? 'text-pink-900 font-bold text-lg' :
                formData.template === 'elegant' ? 'text-rose-900 font-medium text-lg' :
                formData.template === 'classic' ? 'text-amber-900 font-serif font-bold text-lg' :
                'text-gray-900'
              }`}>
                {formData.template === 'tech' ? '>> TOTAL:' :
                 formData.template === 'creative' ? '✨ TOTAL:' :
                 formData.template === 'classic' ? 'TOTAL AMOUNT:' :
                 'TOTAL:'}
              </span>
              <span className={`text-2xl ${
                formData.template === 'minimal' ? 'text-gray-900 font-medium' :
                formData.template === 'tech' ? 'text-white font-mono font-bold' :
                formData.template === 'corporate' ? 'text-white font-bold' :
                formData.template === 'creative' ? 'bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent font-bold' :
                formData.template === 'elegant' ? 'bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent font-semibold' :
                formData.template === 'classic' ? 'text-amber-900 font-serif font-bold' :
                `bg-gradient-to-r ${styles.accent} bg-clip-text text-transparent`
              }`}>
                {formatCurrency(formData.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Terms and Notes - Template-specific styling */}
        {(formData.paymentTerms || formData.notes) && (
          <div className={`space-y-6 pt-8 ${
            formData.template === 'minimal' ? 'border-t border-gray-200' :
            formData.template === 'tech' ? 'border-t border-cyan-200' :
            formData.template === 'corporate' ? 'border-t-2 border-slate-300' :
            formData.template === 'creative' ? 'border-t-2 border-pink-200' :
            formData.template === 'elegant' ? 'border-t border-rose-200' :
            formData.template === 'classic' ? 'border-t-2 border-amber-300' :
            'border-t-2 border-gray-200'
          }`}>
            {formData.paymentTerms && (
              <div className={`p-6 ${
                formData.template === 'minimal' ? 'bg-transparent border-none p-0' :
                formData.template === 'tech' ? 'bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200' :
                formData.template === 'corporate' ? 'bg-slate-100 rounded' :
                formData.template === 'creative' ? 'bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 rounded-2xl border-2 border-pink-200' :
                formData.template === 'elegant' ? 'bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-200' :
                formData.template === 'classic' ? 'bg-amber-50 border border-amber-300' :
                `${styles.headerBg} rounded-xl shadow-sm`
              }`}>
                <h4 className={`font-bold mb-3 text-lg flex items-center ${
                  formData.template === 'minimal' ? 'text-gray-900 font-light text-sm uppercase tracking-widest' :
                  formData.template === 'tech' ? 'text-cyan-900 font-mono' :
                  formData.template === 'corporate' ? 'text-slate-800' :
                  formData.template === 'creative' ? 'text-pink-900' :
                  formData.template === 'elegant' ? 'text-rose-900 font-light' :
                  formData.template === 'classic' ? 'text-amber-900 font-serif' :
                  styles.titleColor
                }`}>
                  {formData.template !== 'minimal' && (
                    <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
                  )}
                  {formData.template === 'tech' ? '// Payment Terms' :
                   formData.template === 'creative' ? '💳 Payment Terms' :
                   'Payment Terms'}
                </h4>
                <p className={`text-sm sm:text-base leading-relaxed ${
                  formData.template === 'minimal' ? 'text-gray-500' :
                  formData.template === 'tech' ? 'text-gray-700 font-mono text-sm' :
                  'text-gray-700'
                }`}>{formData.paymentTerms}</p>
              </div>
            )}
            {formData.notes && (
              <div className={`p-6 ${
                formData.template === 'minimal' ? 'bg-transparent border-none p-0' :
                formData.template === 'tech' ? 'bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200' :
                formData.template === 'corporate' ? 'bg-yellow-50 border border-yellow-200 rounded' :
                formData.template === 'creative' ? 'bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 rounded-2xl border-2 border-yellow-200' :
                formData.template === 'elegant' ? 'bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200' :
                formData.template === 'classic' ? 'bg-yellow-50 border border-yellow-300' :
                'bg-yellow-50 border border-yellow-200 rounded-xl shadow-sm'
              }`}>
                <h4 className={`font-bold mb-3 text-lg flex items-center ${
                  formData.template === 'minimal' ? 'text-gray-900 font-light text-sm uppercase tracking-widest' :
                  formData.template === 'tech' ? 'text-yellow-900 font-mono' :
                  formData.template === 'corporate' ? 'text-yellow-800' :
                  formData.template === 'creative' ? 'text-yellow-900' :
                  formData.template === 'elegant' ? 'text-yellow-900 font-light' :
                  formData.template === 'classic' ? 'text-yellow-900 font-serif' :
                  'text-yellow-900'
                }`}>
                  {formData.template !== 'minimal' && (
                    <ApperIcon name="MessageSquare" className="w-5 h-5 mr-2" />
                  )}
                  {formData.template === 'tech' ? '// Notes' :
                   formData.template === 'creative' ? '📝 Notes' :
                   'Notes'}
                </h4>
                <p className={`text-sm sm:text-base whitespace-pre-line leading-relaxed ${
                  formData.template === 'minimal' ? 'text-gray-500' :
                  formData.template === 'tech' ? 'text-gray-700 font-mono text-sm' :
                  'text-gray-700'
                }`}>{formData.notes}</p>
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