import React from "react";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import TextAreaField from "@/components/molecules/TextAreaField";
import ApperIcon from "@/components/ApperIcon";

const ClientInfoForm = ({ formData, updateField }) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ApperIcon name="Users" className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Client Information</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormField
            label="Client Name"
            id="clientName"
            value={formData.clientName}
            onChange={(e) => updateField("clientName", e.target.value)}
            placeholder="Client Company or Individual"
            required
          />
          
          <div className="lg:row-span-1">
            <TextAreaField
              label="Client Address"
              id="clientAddress"
              value={formData.clientAddress}
              onChange={(e) => updateField("clientAddress", e.target.value)}
              placeholder="456 Client Avenue&#10;City, State ZIP&#10;Country"
              rows={4}
              required
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ClientInfoForm;