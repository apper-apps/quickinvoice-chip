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
        
<div className="space-y-6">
          {/* Currency Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => updateField('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Tax Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.taxRate}
              onChange={(e) => updateField('taxRate', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="0.00"
            />
          </div>

          {/* Discount Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <select
                value={formData.discountType}
                onChange={(e) => updateField('discountType', e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Payment Terms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Terms
            </label>
            <input
              type="text"
              value={formData.paymentTerms}
              onChange={(e) => updateField('paymentTerms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="e.g., Net 30, Due on receipt"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              placeholder="Payment instructions, terms, or other notes..."
            />
          </div>

          {/* Totals Breakdown */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center py-2">
              <span className="text-secondary">Subtotal</span>
              <span className="font-medium text-gray-900">{formatCurrency(formData.subtotal)}</span>
            </div>
            
            {formData.discountAmount > 0 && (
              <div className="flex justify-between items-center py-2 text-green-600">
                <span>
                  Discount ({formData.discountType === 'percentage' 
                    ? `${formData.discountValue}%` 
                    : formatCurrency(formData.discountValue)})
                </span>
                <span>-{formatCurrency(formData.discountAmount)}</span>
              </div>
            )}
            
            {formData.taxAmount > 0 && (
              <div className="flex justify-between items-center py-2">
                <span className="text-secondary">Tax ({formData.taxRate}%)</span>
                <span className="font-medium text-gray-900">{formatCurrency(formData.taxAmount)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center py-3 bg-gradient-to-r from-primary/5 to-accent/5 -mx-6 px-6 rounded-lg">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {formatCurrency(formData.total)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceTotals;