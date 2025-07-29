import React from "react";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import DateField from "@/components/molecules/DateField";
import ApperIcon from "@/components/ApperIcon";

const InvoiceDetailsForm = ({ formData, updateField }) => {
  const today = new Date().toISOString().split("T")[0];
  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ApperIcon name="Calendar" className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Invoice Details</h2>
        </div>
        
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormField
            label="Invoice Number"
            id="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={(e) => updateField("invoiceNumber", e.target.value)}
            placeholder="INV-001"
            required
          />
          
          <DateField
            label="Invoice Date"
            id="date"
            value={formData.date || today}
            onChange={(e) => updateField("date", e.target.value)}
            required
          />
          
          <DateField
            label="Due Date"
            id="dueDate"
            value={formData.dueDate || nextMonth}
            onChange={(e) => updateField("dueDate", e.target.value)}
            required
          />
        </div>
        
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ApperIcon name="Palette" className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Invoice Template</h3>
          </div>
          
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: 'professional', name: 'Professional', desc: 'Clean corporate design', color: 'blue' },
              { value: 'modern', name: 'Modern', desc: 'Contemporary styling', color: 'purple' },
              { value: 'creative', name: 'Creative', desc: 'Vibrant and colorful', color: 'pink' },
              { value: 'minimal', name: 'Minimal', desc: 'Simple and elegant', color: 'gray' },
              { value: 'corporate', name: 'Corporate', desc: 'Dark sophisticated style', color: 'slate' },
              { value: 'elegant', name: 'Elegant', desc: 'Refined luxury design', color: 'rose' },
              { value: 'tech', name: 'Tech', desc: 'Modern technology aesthetic', color: 'cyan' },
              { value: 'classic', name: 'Classic', desc: 'Traditional timeless look', color: 'amber' }
            ].map((template) => (
              <div
                key={template.value}
                onClick={() => updateField("template", template.value)}
                className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-lg ${
                  formData.template === template.value
                    ? `border-${template.color}-500 bg-${template.color}-50 shadow-md`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{template.desc}</p>
                  </div>
                  {formData.template === template.value && (
                    <div className={`w-5 h-5 bg-${template.color}-500 rounded-full flex items-center justify-center`}>
                      <ApperIcon name="Check" className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className={`mt-3 h-8 rounded bg-gradient-to-r ${
                  template.color === 'blue' ? 'from-blue-500 to-blue-600' :
                  template.color === 'purple' ? 'from-purple-500 to-purple-600' :
                  template.color === 'pink' ? 'from-pink-500 to-pink-600' :
                  template.color === 'gray' ? 'from-gray-400 to-gray-500' :
                  template.color === 'slate' ? 'from-slate-600 to-slate-700' :
                  template.color === 'rose' ? 'from-rose-500 to-rose-600' :
                  template.color === 'cyan' ? 'from-cyan-500 to-cyan-600' :
                  template.color === 'amber' ? 'from-amber-500 to-amber-600' :
                  'from-gray-400 to-gray-500'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InvoiceDetailsForm;