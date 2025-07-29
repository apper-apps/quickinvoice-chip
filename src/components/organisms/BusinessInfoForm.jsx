import React from "react";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import TextAreaField from "@/components/molecules/TextAreaField";
import ApperIcon from "@/components/ApperIcon";

const BusinessInfoForm = ({ formData, updateField }) => {
  return (
    <Card className="mb-6">
      <div className="flex items-center mb-4">
        <ApperIcon name="Building2" className="w-5 h-5 text-primary mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">Business Information</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Company Name"
          id="businessName"
          value={formData.businessName}
          onChange={(e) => updateField("businessName", e.target.value)}
          placeholder="Your Business Name"
          required
        />
        
        <FormField
          label="Email Address"
          id="businessEmail"
          type="email"
          value={formData.businessEmail}
          onChange={(e) => updateField("businessEmail", e.target.value)}
          placeholder="business@example.com"
          required
        />
      </div>
      
      <div className="mt-4">
        <TextAreaField
          label="Business Address"
          id="businessAddress"
          value={formData.businessAddress}
          onChange={(e) => updateField("businessAddress", e.target.value)}
          placeholder="123 Business Street&#10;City, State ZIP&#10;Country"
          rows={3}
          required
        />
      </div>
    </Card>
  );
};

export default BusinessInfoForm;