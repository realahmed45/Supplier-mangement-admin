import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SupplierList from "./componenets/SupplierList";
import SupplierDetail from "./componenets/SupplierDetails";

import axios from "axios";

function AdminApp() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(
          "https://delicious-emerald-penalty.glitch.me/api/suppliers"
        );
        setSuppliers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        setLoading(false);
      }
    };

    fetchSuppliers();

    // Set up real-time updates with WebSocket or polling
    const interval = setInterval(fetchSuppliers, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || supplier.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateSupplierStatus = async (id, status) => {
    try {
      await axios.patch(
        `https://delicious-emerald-penalty.glitch.me/api/suppliers/${id}`,
        {
          status,
        }
      );
      setSuppliers((prev) =>
        prev.map((supplier) =>
          supplier._id === id ? { ...supplier, status } : supplier
        )
      );
    } catch (error) {
      console.error("Error updating supplier status:", error);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/"
              element={
                <SupplierList
                  suppliers={filteredSuppliers}
                  loading={loading}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  updateSupplierStatus={updateSupplierStatus}
                />
              }
            />
            <Route
              path="/supplier/:id"
              element={<SupplierDetail suppliers={suppliers} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default AdminApp;
