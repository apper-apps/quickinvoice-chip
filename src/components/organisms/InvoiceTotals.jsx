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
    <Card
        className="w-full md:w-80 bg-gradient-to-br from-gray-50 to-white border-gray-200">
        <div className="flex items-center mb-4">
            <ApperIcon name="Calculator" className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Invoice Total</h2>
        </div>
        <div className="space-y-8">
            {/* Settings Section */}
            <div className="space-y-6">
                {/* Currency Selection */}
                <div
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                    <label
                        className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-4">
                        <ApperIcon name="DollarSign" size={16} className="text-blue-600" />Currency
                                      </label>
                    <select
                        value={formData.currency}
                        onChange={e => updateField("currency", e.target.value)}
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900 shadow-sm hover:shadow-lg hover:border-blue-300 text-base font-medium">
                        {currencies.map(currency => <option key={currency.code} value={currency.code}>
                            {currency.code}- {currency.name}({currency.symbol})
                                              </option>)}
                    </select>
                </div>
                {/* Tax and Discount Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tax Settings */}
                    <div
                        className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
                        <label
                            className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-4">
                            <ApperIcon name="Percent" size={16} className="text-green-600" />Tax Rate (%)
                                            </label>
                        <div className="relative">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={formData.taxRate}
                                onChange={e => updateField("taxRate", parseFloat(e.target.value) || 0)}
                                className="w-full px-4 py-3.5 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white shadow-sm hover:shadow-lg hover:border-green-300 text-base font-medium"
                                placeholder="0.00" />
                            <span
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">%</span>
                        </div>
                    </div>
                    {/* Discount Settings */}
                    <div
                        className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-xl border border-orange-100">
                        <label
                            className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-4">
                            <ApperIcon name="Tags" size={16} className="text-orange-600" />Discount
                                            </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative">
                                <select
                                    value={formData.discountType}
                                    onChange={e => updateField("discountType", e.target.value)}
                                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white shadow-sm hover:shadow-lg hover:border-orange-300 text-base font-medium appearance-none">
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount</option>
                                </select>
                                <ApperIcon
                                    name="ChevronDown"
                                    size={16}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.discountValue}
                                    onChange={e => updateField("discountValue", parseFloat(e.target.value) || 0)}
                                    className="w-full px-4 py-3.5 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white shadow-sm hover:shadow-lg hover:border-orange-300 text-base font-medium"
                                    placeholder="0.00" />
                                <span
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                                    {formData.discountType === "percentage" ? "%" : "$"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Terms and Notes Section */}
            <div className="space-y-6">
                {/* Payment Terms */}
                <div
                    className="bg-gradient-to-br from-purple-50 to-violet-50 p-5 rounded-xl border border-purple-100">
                    <label
                        className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-4">
                        <ApperIcon name="Calendar" size={16} className="text-purple-600" />Payment Terms
                                      </label>
                    <input
                        type="text"
                        value={formData.paymentTerms}
                        onChange={e => updateField("paymentTerms", e.target.value)}
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white text-gray-900 shadow-sm hover:shadow-lg hover:border-purple-300 text-base font-medium"
                        placeholder="e.g., Net 30, Due on receipt" />
                </div>
            </div>
            {/* Additional Notes */}
            <div
                className="bg-gradient-to-br from-gray-50 to-slate-50 p-5 rounded-xl border border-gray-200">
                <label
                    className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-4">
                    <ApperIcon name="FileText" size={16} className="text-gray-600" />Additional Notes
                                  </label>
                <textarea
                    value={formData.notes}
                    onChange={e => updateField("notes", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none transition-all duration-300 bg-white shadow-sm hover:shadow-lg hover:border-gray-300 text-base font-medium"
                    placeholder="Payment instructions, terms, or other notes..." />
            </div>
        </div>
        {/* Totals Breakdown */}
        <div
            className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-6 space-y-4 border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Calculator" className="w-5 h-5 mr-2 text-primary" />Invoice Summary
                            </h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Subtotal</span>
                    <span className="font-semibold text-gray-900 text-lg">{formatCurrency(formData.subtotal)}</span>
                </div>
                {formData.discountAmount > 0 && <div className="flex justify-between items-center py-2 text-green-600">
                    <span className="font-medium">Discount ({formData.discountType === "percentage" ? `${formData.discountValue}%` : formatCurrency(formData.discountValue)})
                                          </span>
                    <span className="font-semibold text-lg">-{formatCurrency(formData.discountAmount)}</span>
                </div>}
                {formData.taxAmount > 0 && <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Tax ({formData.taxRate}%)</span>
                    <span className="font-semibold text-gray-900 text-lg">{formatCurrency(formData.taxAmount)}</span>
                </div>}
                <div className="border-t border-gray-300 pt-4 mt-4">
                    <div
                        className="flex justify-between items-center py-2 bg-gradient-to-r from-primary/10 to-accent/10 -mx-2 px-4 rounded-lg">
                        <span className="text-xl font-bold text-gray-900">Total</span>
                        <span
                            className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            {formatCurrency(formData.total)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </Card></div>
  );
};

export default InvoiceTotals;