import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const InvoiceTotals = ({ subtotal, total }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  return (
    <div className="flex justify-end mb-6">
      <Card className="w-full md:w-80 bg-gradient-to-br from-gray-50 to-white border-gray-200">
        <div className="flex items-center mb-4">
          <ApperIcon name="Calculator" className="w-5 h-5 text-primary mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Invoice Total</h2>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-secondary">Subtotal</span>
            <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
          </div>
          
          <div className="flex justify-between items-center py-3 bg-gradient-to-r from-primary/5 to-accent/5 -mx-6 px-6 rounded-lg">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceTotals;