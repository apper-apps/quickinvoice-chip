import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const InvoiceTotals = ({ formData, updateField, formatCurrency }) => {
const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
{ code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' }
  ];

  return (
    <div className="flex justify-end mb-6">
      <Card className="w-full md:w-80 bg-gradient-to-br from-gray-50 to-white border-gray-200">
        <div className="flex items-center mb-4">
          <ApperIcon name="Calculator" className="w-5 h-5 text-primary mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Invoice Total</h2>
        </div>
        
<div className="space-y-8">
          {/* Settings Section */}
          <div className="space-y-6">
            {/* Currency Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => updateField('currency', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-3 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white text-gray-900 shadow-sm hover:shadow-md"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name} ({currency.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Tax and Discount Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tax Settings */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.taxRate}
                  onChange={(e) => updateField('taxRate', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-3 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                  placeholder="0.00"
                />
              </div>

              {/* Discount Settings */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Discount
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={formData.discountType}
                    onChange={(e) => updateField('discountType', e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-3 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discountValue}
                    onChange={(e) => updateField('discountValue', parseFloat(e.target.value) || 0)}
                    className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-3 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Notes Section */}
          <div className="space-y-6">
            {/* Payment Terms */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Payment Terms
              </label>
              <input
                type="text"
                value={formData.paymentTerms}
                onChange={(e) => updateField('paymentTerms', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-3 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                placeholder="e.g., Net 30, Due on receipt"
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-3 focus:ring-primary/20 focus:border-primary resize-none transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                placeholder="Payment instructions, terms, or other notes..."
              />
            </div>
          </div>

          {/* Totals Breakdown */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-6 space-y-4 border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Calculator" className="w-5 h-5 mr-2 text-primary" />
              Invoice Summary
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">Subtotal</span>
                <span className="font-semibold text-gray-900 text-lg">{formatCurrency(formData.subtotal)}</span>
              </div>
              
              {formData.discountAmount > 0 && (
                <div className="flex justify-between items-center py-2 text-green-600">
                  <span className="font-medium">
                    Discount ({formData.discountType === 'percentage' 
                      ? `${formData.discountValue}%` 
                      : formatCurrency(formData.discountValue)})
                  </span>
                  <span className="font-semibold text-lg">-{formatCurrency(formData.discountAmount)}</span>
                </div>
              )}
              
              {formData.taxAmount > 0 && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Tax ({formData.taxRate}%)</span>
                  <span className="font-semibold text-gray-900 text-lg">{formatCurrency(formData.taxAmount)}</span>
                </div>
              )}
              
              <div className="border-t border-gray-300 pt-4 mt-4">
                <div className="flex justify-between items-center py-2 bg-gradient-to-r from-primary/10 to-accent/10 -mx-2 px-4 rounded-lg">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {formatCurrency(formData.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceTotals;