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
    subtotal: 0,
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
    const total = subtotal; // No tax for simplicity
    
    setFormData(prev => ({
      ...prev,
      subtotal,
      total
    }));
  }, [lineItems]);

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <InvoiceHeader />
        
        <div className="space-y-6">
          <InvoiceDetailsForm 
            formData={formData} 
            updateField={updateField} 
          />
          
          <BusinessInfoForm 
            formData={formData} 
            updateField={updateField} 
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
          />
          
          <InvoiceTotals 
            subtotal={formData.subtotal}
            total={formData.total}
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
      </div>
    </div>
  );
};

export default InvoiceGenerator;