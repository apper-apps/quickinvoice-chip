import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const LineItemsTable = ({ lineItems, updateLineItem, addLineItem, removeLineItem }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ApperIcon name="List" className="w-5 h-5 text-primary mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Line Items</h2>
        </div>
        
        <Button onClick={addLineItem} size="sm">
          <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
          Add Item
        </Button>
      </div>
      
      {lineItems.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <ApperIcon name="Package" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-secondary">No items added yet</p>
          <p className="text-sm text-gray-400">Click "Add Item" to get started</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Description</th>
                <th className="text-center py-3 px-2 text-sm font-medium text-gray-600 w-20">Qty</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-600 w-24">Rate</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-600 w-24">Amount</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="py-3 px-2">
                    <Input
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                      placeholder="Item description"
                      className="border-none bg-transparent focus:bg-white focus:border-gray-200"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                      placeholder="1"
                      min="0"
                      step="0.01"
                      className="text-center border-none bg-transparent focus:bg-white focus:border-gray-200"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateLineItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="text-right border-none bg-transparent focus:bg-white focus:border-gray-200"
                    />
                  </td>
                  <td className="py-3 px-2 text-right font-medium text-gray-900">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() => removeLineItem(item.id)}
                      className="text-gray-400 hover:text-error transition-colors p-1"
                      title="Remove item"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default LineItemsTable;