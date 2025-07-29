import React from "react";
import { Routes, Route } from "react-router-dom";
import InvoiceGenerator from "@/components/pages/InvoiceGenerator";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<InvoiceGenerator />} />
        <Route path="*" element={<InvoiceGenerator />} />
      </Routes>
    </div>
  );
}

export default App;