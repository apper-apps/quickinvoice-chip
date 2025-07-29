import React from "react";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import TextAreaField from "@/components/molecules/TextAreaField";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const BusinessInfoForm = ({ formData, updateField, onLogoUpload }) => {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <ApperIcon name="Building" className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">
            Business Information
          </h2>
        </div>
        
        <div className="space-y-4">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Logo
            </label>
            <div className="flex items-start gap-4">
              {formData.logoUrl && (
                <div className="w-20 h-20 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img 
                    src={formData.logoUrl} 
                    alt="Company Logo" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
                  {formData.logoUrl ? 'Change Logo' : 'Upload Logo'}
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Maximum file size: 2MB. Supported formats: JPG, PNG, GIF
                </p>
              </div>
            </div>
          </div>

          <FormField
            label="Business Name"
            id="businessName"
            required
            value={formData.businessName}
            onChange={(e) => updateField("businessName", e.target.value)}
            placeholder="Your Business Name"
          />
          
          <TextAreaField
            label="Business Address"
            id="businessAddress"
            required
            value={formData.businessAddress}
            onChange={(e) => updateField("businessAddress", e.target.value)}
            placeholder="123 Business Street&#10;City, State 12345&#10;Country"
            rows={3}
          />
          
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
    </Card>
  );
};

export default BusinessInfoForm;