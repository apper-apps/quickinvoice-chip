import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const InvoiceHeader = () => {
  return (
    <Card className="mb-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <ApperIcon name="FileText" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              QuickInvoice
            </h1>
            <p className="text-secondary text-sm">Professional Invoice Generator</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-secondary">Create beautiful invoices</p>
          <p className="text-xs text-secondary/70">Download as PDF instantly</p>
        </div>
      </div>
    </Card>
  );
};

export default InvoiceHeader;