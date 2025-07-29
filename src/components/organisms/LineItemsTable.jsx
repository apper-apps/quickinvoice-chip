import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const LineItemsTable = ({ lineItems, updateLineItem, addLineItem, removeLineItem, formatCurrency }) => {
  // formatCurrency now passed as prop for dynamic currency support

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
<div className="overflow-x-auto -mx-2 sm:mx-0">
          <div className="min-w-full sm:min-w-0">
            <table className="w-full min-w-[600px] sm:min-w-0">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50/50">
                  <th className="text-left py-4 px-3 sm:px-4 text-sm font-semibold text-gray-700">Description</th>
                  <th className="text-center py-4 px-2 sm:px-3 text-sm font-semibold text-gray-700 w-20 sm:w-24">Qty</th>
                  <th className="text-right py-4 px-2 sm:px-3 text-sm font-semibold text-gray-700 w-24 sm:w-28">Rate</th>
                  <th className="text-right py-4 px-2 sm:px-3 text-sm font-semibold text-gray-700 w-24 sm:w-28">Amount</th>
                  <th className="w-12 sm:w-14"></th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors duration-150">
                    <td className="py-4 px-3 sm:px-4">
                      <Input
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                        placeholder="Item description"
                        className="border-none bg-transparent focus:bg-white focus:border-gray-300 focus:shadow-sm transition-all duration-200 min-h-[44px]"
                      />
                    </td>
                    <td className="py-4 px-2 sm:px-3">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                        placeholder="1"
                        min="0"
                        step="0.01"
                        className="text-center border-none bg-transparent focus:bg-white focus:border-gray-300 focus:shadow-sm transition-all duration-200 min-h-[44px]"
                      />
                    </td>
                    <td className="py-4 px-2 sm:px-3">
                      <Input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateLineItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="text-right border-none bg-transparent focus:bg-white focus:border-gray-300 focus:shadow-sm transition-all duration-200 min-h-[44px]"
                      />
                    </td>
                    <td className="py-4 px-2 sm:px-3 text-right font-semibold text-gray-900 text-sm sm:text-base">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="py-4 px-2 sm:px-3">
                      <button
                        onClick={() => removeLineItem(item.id)}
                        className="text-gray-400 hover:text-error transition-colors p-2 rounded-md hover:bg-red-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
        </div>
      )}
    </Card>
  );
};

export default LineItemsTable;