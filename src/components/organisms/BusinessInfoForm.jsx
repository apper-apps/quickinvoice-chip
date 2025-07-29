import React from "react";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import TextAreaField from "@/components/molecules/TextAreaField";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const BusinessInfoForm = ({ formData, updateField, onLogoUpload }) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ApperIcon name="Building" className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Business Information
          </h2>
        </div>
        
        <div className="space-y-6 sm:space-y-8">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-4">
              Company Logo
            </label>
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              {formData.logoUrl && (
                <div className="w-24 h-24 sm:w-28 sm:h-28 border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center shadow-sm">
                  <img 
                    src={formData.logoUrl} 
                    alt="Company Logo" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
              <div className="flex-1 w-full sm:w-auto">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-primary/50 cursor-pointer transition-all duration-200 min-h-[48px]"
                >
                  <ApperIcon name="Upload" className="w-5 h-5 mr-2" />
                  {formData.logoUrl ? 'Change Logo' : 'Upload Logo'}
                </label>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Maximum file size: 2MB. Supported formats: JPG, PNG, GIF
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <FormField
                label="Business Name"
                id="businessName"
                required
                value={formData.businessName}
                onChange={(e) => updateField("businessName", e.target.value)}
                placeholder="Your Business Name"
              />
            </div>
            
            <div className="sm:col-span-2">
              <TextAreaField
                label="Business Address"
                id="businessAddress"
                required
                value={formData.businessAddress}
                onChange={(e) => updateField("businessAddress", e.target.value)}
                placeholder="123 Business Street&#10;City, State 12345&#10;Country"
                rows={4}
              />
            </div>
            
            <div className="sm:col-span-1">
              <FormField
                label="Business Email"
                id="businessEmail"
                type="email"
                required
                value={formData.businessEmail}
                onChange={(e) => updateField("businessEmail", e.target.value)}
                placeholder="business@company.com"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BusinessInfoForm;