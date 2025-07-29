import React from "react";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import TextAreaField from "@/components/molecules/TextAreaField";
import ApperIcon from "@/components/ApperIcon";

const ClientInfoForm = ({ formData, updateField }) => {
  return (
    <Card className="mb-6">
      <div className="flex items-center mb-4">
        <ApperIcon name="Users" className="w-5 h-5 text-primary mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">Client Information</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Client Name"
          id="clientName"
          value={formData.clientName}
          onChange={(e) => updateField("clientName", e.target.value)}
          placeholder="Client Company or Individual"
          required
        />
        
        <div className="md:row-span-2">
          <TextAreaField
            label="Client Address"
            id="clientAddress"
            value={formData.clientAddress}
            onChange={(e) => updateField("clientAddress", e.target.value)}
            placeholder="456 Client Avenue&#10;City, State ZIP&#10;Country"
            rows={3}
            required
          />
        </div>
      </div>
    </Card>
  );
};

export default ClientInfoForm;