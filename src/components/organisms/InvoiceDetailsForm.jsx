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
              { 
                value: 'professional', 
                name: 'Professional', 
                desc: 'Clean lines with structured layout', 
                color: 'blue',
                preview: 'border-structured'
              },
              { 
                value: 'modern', 
                name: 'Modern', 
                desc: 'Bold typography with geometric elements', 
                color: 'purple',
                preview: 'geometric-bold'
              },
              { 
                value: 'creative', 
                name: 'Creative', 
                desc: 'Rounded corners with vibrant gradients', 
                color: 'pink',
                preview: 'rounded-gradient'
              },
              { 
                value: 'minimal', 
                name: 'Minimal', 
                desc: 'Maximum whitespace with thin lines', 
                color: 'gray',
                preview: 'minimal-lines'
              },
              { 
                value: 'corporate', 
                name: 'Corporate', 
                desc: 'Strong borders with dark accents', 
                color: 'slate',
                preview: 'strong-borders'
              },
              { 
                value: 'elegant', 
                name: 'Elegant', 
                desc: 'Refined spacing with decorative touches', 
                color: 'rose',
                preview: 'decorative-refined'
              },
              { 
                value: 'tech', 
                name: 'Tech', 
                desc: 'Sharp angles with modern glow effects', 
                color: 'cyan',
                preview: 'angular-glow'
              },
              { 
                value: 'classic', 
                name: 'Classic', 
                desc: 'Traditional layout with serif elements', 
                color: 'amber',
                preview: 'traditional-serif'
              }
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
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{template.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{template.desc}</p>
                  </div>
                  {formData.template === template.value && (
                    <div className={`w-5 h-5 bg-${template.color}-500 rounded-full flex items-center justify-center`}>
                      <ApperIcon name="Check" className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Design Preview based on template style */}
                <div className="space-y-2">
                  {template.preview === 'border-structured' && (
                    <div className="space-y-1">
                      <div className={`h-2 bg-${template.color}-500 rounded-sm`} />
                      <div className="flex space-x-1">
                        <div className={`h-1 w-8 bg-${template.color}-300 rounded-sm`} />
                        <div className={`h-1 w-6 bg-${template.color}-300 rounded-sm`} />
                      </div>
                      <div className={`h-1 w-full bg-gray-200 border border-${template.color}-200 rounded-sm`} />
                    </div>
                  )}
                  
                  {template.preview === 'geometric-bold' && (
                    <div className="space-y-1">
                      <div className={`h-3 bg-gradient-to-r from-${template.color}-500 to-${template.color}-600 transform skew-x-12`} />
                      <div className="flex space-x-1">
                        <div className={`h-1 w-4 bg-${template.color}-400 transform skew-x-6`} />
                        <div className={`h-1 w-8 bg-${template.color}-300`} />
                      </div>
                    </div>
                  )}
                  
                  {template.preview === 'rounded-gradient' && (
                    <div className="space-y-2">
                      <div className={`h-2 bg-gradient-to-r from-${template.color}-400 via-${template.color}-500 to-${template.color}-600 rounded-full`} />
                      <div className="flex space-x-1">
                        <div className={`h-1 w-6 bg-${template.color}-300 rounded-full`} />
                        <div className={`h-1 w-4 bg-${template.color}-200 rounded-full`} />
                      </div>
                    </div>
                  )}
                  
                  {template.preview === 'minimal-lines' && (
                    <div className="space-y-3">
                      <div className={`h-px bg-${template.color}-300`} />
                      <div className="flex justify-between">
                        <div className={`h-px w-6 bg-${template.color}-200`} />
                        <div className={`h-px w-4 bg-${template.color}-200`} />
                      </div>
                      <div className={`h-px bg-gray-200`} />
                    </div>
                  )}
                  
                  {template.preview === 'strong-borders' && (
                    <div className={`border-2 border-${template.color}-600 p-1 bg-${template.color}-50`}>
                      <div className={`h-1 bg-${template.color}-700 mb-1`} />
                      <div className="flex space-x-1">
                        <div className={`h-1 w-4 bg-${template.color}-500`} />
                        <div className={`h-1 w-6 bg-${template.color}-400`} />
                      </div>
                    </div>
                  )}
                  
                  {template.preview === 'decorative-refined' && (
                    <div className="space-y-1">
                      <div className={`h-2 bg-gradient-to-r from-transparent via-${template.color}-400 to-transparent rounded-full`} />
                      <div className="flex justify-center space-x-2">
                        <div className={`h-1 w-1 bg-${template.color}-500 rounded-full`} />
                        <div className={`h-1 w-8 bg-${template.color}-300 rounded-sm`} />
                        <div className={`h-1 w-1 bg-${template.color}-500 rounded-full`} />
                      </div>
                    </div>
                  )}
                  
                  {template.preview === 'angular-glow' && (
                    <div className="space-y-1">
                      <div className={`h-2 bg-${template.color}-500 clip-path-polygon shadow-lg shadow-${template.color}-300/50`} style={{clipPath: 'polygon(0 0, 90% 0, 100% 100%, 10% 100%)'}} />
                      <div className="flex space-x-1">
                        <div className={`h-1 w-6 bg-${template.color}-400 shadow-sm shadow-${template.color}-200`} />
                        <div className={`h-1 w-4 bg-${template.color}-300`} />
                      </div>
                    </div>
                  )}
                  
                  {template.preview === 'traditional-serif' && (
                    <div className="space-y-1">
                      <div className={`h-2 bg-${template.color}-600 relative`}>
                        <div className={`absolute top-0 left-0 w-2 h-2 bg-${template.color}-700 transform rotate-45 -translate-x-1 -translate-y-1`} />
                      </div>
                      <div className="flex space-x-1">
                        <div className={`h-1 w-8 bg-${template.color}-400 border-b border-${template.color}-600`} />
                        <div className={`h-1 w-4 bg-${template.color}-300`} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InvoiceDetailsForm;