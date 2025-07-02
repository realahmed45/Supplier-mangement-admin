import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Search,
  Filter,
  Building2,
  User,
  Mail,
  Package,
  MapPin,
  Clock,
  FileText,
  Truck,
} from "lucide-react";

const SupplierList = ({
  suppliers,
  loading,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  updateSupplierStatus,
  userRole,
}) => {
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  const renderActionButtons = (supplier) => {
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        <Link
          to={`/supplier/${supplier._id}`}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm"
        >
          View Details
        </Link>

        {userRole === "admin" && supplier.status !== "Approved" && (
          <button
            onClick={() => updateSupplierStatus(supplier._id, "Approved")}
            className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium text-sm"
          >
            Approve
          </button>
        )}

        {userRole === "admin" && supplier.status !== "Rejected" && (
          <button
            onClick={() => updateSupplierStatus(supplier._id, "Rejected")}
            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium text-sm"
          >
            Reject
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading suppliers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                <Building2 className="text-blue-600" size={40} />
                Supplier Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and track your supplier relationships
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 lg:min-w-96">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="relative">
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-36"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Suppliers Grid */}
        <div className="space-y-6">
          {suppliers.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Building2 className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No suppliers found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            suppliers.map((supplier) => (
              <div
                key={supplier._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Profile Section */}
                    <div className="flex items-center gap-4 lg:min-w-80">
                      <div className="relative">
                        {supplier.profilePicture ? (
                          <img
                            className="h-16 w-16 rounded-full object-cover border-4 border-blue-100"
                            src={supplier.profilePicture}
                            alt={supplier.companyName}
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextElementSibling.style.display =
                                "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className={`h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg ${
                            supplier.profilePicture ? "hidden" : "flex"
                          }`}
                        >
                          {supplier.companyName?.charAt(0) || "S"}
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white ${
                            getStatusColor(supplier.status).includes("emerald")
                              ? "bg-emerald-400"
                              : getStatusColor(supplier.status).includes("red")
                              ? "bg-red-400"
                              : "bg-amber-400"
                          }`}
                        ></div>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {supplier.companyName}
                        </h3>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {supplier.businessType?.length > 0 ? (
                            supplier.businessType.map((type, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                              >
                                {type}
                              </span>
                            ))
                          ) : (
                            <span className="text-blue-600 font-medium text-sm">
                              Business Type Not Specified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            {supplier.contactPerson}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail size={14} />
                            {supplier.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <Package
                          className="mx-auto text-blue-500 mb-1"
                          size={18}
                        />
                        <p className="text-sm font-semibold text-gray-800">
                          {supplier.products?.length || 0}
                        </p>
                        <p className="text-xs text-gray-500">Products</p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <MapPin
                          className="mx-auto text-green-500 mb-1"
                          size={18}
                        />
                        <p className="text-sm font-semibold text-gray-800">
                          {supplier.warehouses?.length || 0}
                        </p>
                        <p className="text-xs text-gray-500">Warehouses</p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <FileText
                          className="mx-auto text-red-500 mb-1"
                          size={18}
                        />
                        <p className="text-sm font-semibold text-gray-800">
                          {supplier.documents?.length || 0}
                        </p>
                        <p className="text-xs text-gray-500">Documents</p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <Truck
                          className="mx-auto text-indigo-500 mb-1"
                          size={18}
                        />
                        <p className="text-sm font-semibold text-gray-800">
                          {supplier.shippingMethods?.length || 0}
                        </p>
                        <p className="text-xs text-gray-500">Shipping</p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <Clock
                          className="mx-auto text-purple-500 mb-1"
                          size={18}
                        />
                        <p className="text-sm font-semibold text-gray-800">
                          {supplier.yearsInBusiness || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">Years</p>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex flex-col gap-3 lg:min-w-48">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            supplier.status
                          )}`}
                        >
                          {supplier.status}
                        </span>
                      </div>

                      {renderActionButtons(supplier)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierList;
