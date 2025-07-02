import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";
import SupplierList from "./componenets/SupplierList";
import SupplierDetail from "./componenets/SupplierDetails";
import UserManagement from "./componenets/userManagement";
import Login from "./componenets/Login";
import { Building2, User, Home, ArrowLeft } from "lucide-react";

import axios from "axios";

function App() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [user, setUser] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Check auth status on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setLastActivity(Date.now());
      } catch (err) {
        logout();
      }
    }

    // Set up activity listeners
    const updateActivity = () => {
      setLastActivity(Date.now());
      localStorage.setItem("lastActivity", Date.now());
    };

    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keypress", updateActivity);
    window.addEventListener("click", updateActivity);

    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keypress", updateActivity);
      window.removeEventListener("click", updateActivity);
    };
  }, []);

  // Check inactivity every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastActivity && Date.now() - lastActivity > 60000) {
        logout();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [lastActivity]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("lastActivity");
    setUser(null);
  };

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://delicious-emerald-penalty.glitch.me/api/suppliers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuppliers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setLoading(false);
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchSuppliers();
      const interval = setInterval(fetchSuppliers, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

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
      const token = localStorage.getItem("token");
      await axios.patch(
        `https://delicious-emerald-penalty.glitch.me/api/suppliers/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuppliers((prev) =>
        prev.map((supplier) =>
          supplier._id === id ? { ...supplier, status } : supplier
        )
      );
    } catch (error) {
      console.error("Error updating supplier status:", error);
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {user && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center shadow-md">
            <div className="font-bold text-lg flex items-center gap-2">
              <Building2 className="h-6 w-6 text-blue-200" />
              <span>
                Welcome, <span className="text-blue-100">{user.username}</span>
                <span
                  className={`ml-2 text-xs px-2 py-1 rounded-full ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {user.role}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 hover:shadow-sm transition-all"
              >
                <Home className="h-5 w-5" />
                <span>Supplier List</span>
              </Link>

              {user?.role === "admin" && (
                <Link
                  to="/users"
                  className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 hover:shadow-sm transition-all"
                >
                  <User className="h-5 w-5" />
                  <span>Manage Users</span>
                </Link>
              )}

              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 hover:shadow-sm transition-all"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
            />
            <Route
              path="/"
              element={
                user ? (
                  <SupplierList
                    suppliers={filteredSuppliers}
                    loading={loading}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    updateSupplierStatus={
                      user.role === "admin" ? updateSupplierStatus : null
                    }
                    userRole={user.role}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/supplier/:id"
              element={
                user ? (
                  <SupplierDetail suppliers={suppliers} userRole={user.role} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            // Add this route inside your Routes component
            <Route
              path="/users"
              element={
                user?.role === "admin" ? (
                  <UserManagement />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// Simple JWT decode function
function jwtDecode(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default App;
