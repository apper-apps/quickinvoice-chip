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

  const InvoicePreview = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
      <div className="flex justify-between items-start mb-8">
        <div>
          {formData.logoUrl && (
            <img 
              src={formData.logoUrl} 
              alt="Company Logo" 
              className="h-16 w-auto mb-4 object-contain"
            />
          )}
          <h1 className="text-2xl font-bold text-gray-900">
            {formData.businessName || "Your Business Name"}
          </h1>
          <p className="text-gray-600 mt-1 whitespace-pre-line">
            {formData.businessAddress || "Business Address"}
          </p>
          <p className="text-gray-600">
            {formData.businessEmail || "business@email.com"}
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold text-gray-900">INVOICE</h2>
          <p className="text-gray-600 mt-1">
            #{formData.invoiceNumber || "000001"}
          </p>
          <p className="text-gray-600">
            Date: {formData.date || "Select Date"}
          </p>
          <p className="text-gray-600">
            Due: {formData.dueDate || "Select Due Date"}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
        <p className="font-medium">{formData.clientName || "Client Name"}</p>
        <p className="text-gray-600 whitespace-pre-line">
          {formData.clientAddress || "Client Address"}
        </p>
      </div>

      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 text-gray-900">Description</th>
              <th className="text-right py-2 text-gray-900">Qty</th>
              <th className="text-right py-2 text-gray-900">Rate</th>
              <th className="text-right py-2 text-gray-900">Amount</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.length > 0 ? lineItems.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-2">{item.description || "Item description"}</td>
                <td className="text-right py-2">{item.quantity || 0}</td>
                <td className="text-right py-2">{formatCurrency(item.rate || 0)}</td>
                <td className="text-right py-2">{formatCurrency(item.amount || 0)}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No line items added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(formData.subtotal)}</span>
          </div>
          {formData.discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>
                Discount ({formData.discountType === 'percentage' 
                  ? `${formData.discountValue}%` 
                  : formatCurrency(formData.discountValue)}):
              </span>
              <span>-{formatCurrency(formData.discountAmount)}</span>
            </div>
          )}
          {formData.taxAmount > 0 && (
            <div className="flex justify-between">
              <span>Tax ({formData.taxRate}%):</span>
              <span>{formatCurrency(formData.taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span>{formatCurrency(formData.total)}</span>
          </div>
        </div>
      </div>

      {(formData.paymentTerms || formData.notes) && (
        <div className="space-y-4">
          {formData.paymentTerms && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Payment Terms:</h4>
              <p className="text-gray-600">{formData.paymentTerms}</p>
            </div>
          )}
          {formData.notes && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Notes:</h4>
              <p className="text-gray-600 whitespace-pre-line">{formData.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

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
<div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InvoiceHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
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
            
            <div className="flex justify-center pt-6">
              <Button
                onClick={handleGeneratePDF}
                loading={isGenerating}
                size="lg"
                className="px-8"
              >
                <ApperIcon name="Download" className="w-5 h-5 mr-2" />
                {isGenerating ? "Generating PDF..." : "Generate & Download PDF"}
              </Button>
            </div>
          </div>

          {/* Live Preview Section */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <ApperIcon name="Eye" className="w-5 h-5 mr-2" />
                Live Preview
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                This preview shows how your invoice will appear in the PDF
              </p>
            </div>
            <InvoicePreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;