import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  CreditCard,
  Calendar,
  Award,
  Package,
  Warehouse,
  Truck,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

const SupplierDetail = ({ suppliers }) => {
  const { id } = useParams();
  const supplier = suppliers.find((s) => s._id === id);

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
          <Building2 className="mx-auto text-gray-300 mb-4" size={64} />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Supplier Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The supplier you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Suppliers
          </Link>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case "Approved":
        return {
          color: "bg-emerald-100 text-emerald-800 border-emerald-200",
          icon: CheckCircle,
          iconColor: "text-emerald-600",
        };
      case "Rejected":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: XCircle,
          iconColor: "text-red-600",
        };
      default:
        return {
          color: "bg-amber-100 text-amber-800 border-amber-200",
          icon: Clock,
          iconColor: "text-amber-600",
        };
    }
  };

  const statusConfig = getStatusConfig(supplier.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
              >
                <ArrowLeft size={24} />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <Building2 className="text-blue-600" size={32} />
                  {supplier.companyName}
                </h1>
                <p className="text-blue-600 font-medium mt-1">
                  {supplier.businessType}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <StatusIcon className={statusConfig.iconColor} size={20} />
              <span
                className={`px-4 py-2 rounded-xl text-sm font-semibold border ${statusConfig.color}`}
              >
                {supplier.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Profile & Contact Info */}
          <div className="xl:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  {supplier.profilePicture ? (
                    <img
                      src={supplier.profilePicture}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover border-4 border-blue-100 mx-auto"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl mx-auto ${
                      supplier.profilePicture ? "hidden" : "flex"
                    }`}
                  >
                    {supplier.companyName?.charAt(0) || "S"}
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mt-4">
                  {supplier.contactPerson}
                </h2>
                <p className="text-gray-600">{supplier.email}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Phone className="text-blue-500" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Phone</p>
                    <p className="text-gray-800">{supplier.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <MapPin className="text-green-500 mt-1" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Address</p>
                    <p className="text-gray-800 text-sm">
                      {supplier.address?.street}
                      <br />
                      {supplier.address?.city}, {supplier.address?.state}{" "}
                      {supplier.address?.postalCode}
                      <br />
                      {supplier.address?.country}
                    </p>
                  </div>
                </div>

                {supplier.website && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Globe className="text-purple-500" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Website
                      </p>
                      <a
                        href={supplier.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {supplier.website}
                      </a>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <CreditCard
                      className="mx-auto text-orange-500 mb-2"
                      size={20}
                    />
                    <p className="text-sm font-medium text-gray-600">Tax ID</p>
                    <p className="text-gray-800 text-sm">{supplier.taxId}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <Calendar
                      className="mx-auto text-indigo-500 mb-2"
                      size={20}
                    />
                    <p className="text-sm font-medium text-gray-600">
                      Experience
                    </p>
                    <p className="text-gray-800 text-sm">
                      {supplier.yearsInBusiness} years
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications */}
            {supplier.certifications?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Award className="text-yellow-500" size={20} />
                  Certifications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {supplier.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800 px-3 py-2 rounded-full text-sm font-medium border border-blue-200"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Products */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Package className="text-blue-500" size={24} />
                Products ({supplier.products?.length || 0})
              </h3>

              {supplier.products?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Product
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Category
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Min Qty
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Price
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Available
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplier.products.map((product, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-800">
                              {product.name}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {product.category}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {product.minOrderQuantity}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-green-600">
                              {product.price} {product.unit}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {product.availableQuantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No products listed
                </p>
              )}
            </div>

            {/* Warehouses */}
            {supplier.warehouses?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Warehouse className="text-orange-500" size={24} />
                  Warehouses ({supplier.warehouses.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {supplier.warehouses.map((warehouse, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border"
                    >
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <MapPin className="text-red-500" size={16} />
                        {warehouse.location}
                      </h4>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="text-center p-2 bg-white rounded-lg">
                          <p className="text-gray-500">Size</p>
                          <p className="font-semibold text-gray-800">
                            {warehouse.size} sq ft
                          </p>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg">
                          <p className="text-gray-500">Capacity</p>
                          <p className="font-semibold text-gray-800">
                            {warehouse.capacity}
                          </p>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg">
                          <p className="text-gray-500">Daily</p>
                          <p className="font-semibold text-gray-800">
                            {warehouse.handlingCapacity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Logistics & Payment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Logistics */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Truck className="text-green-500" size={20} />
                  Logistics
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Shipping Methods
                    </h4>
                    {supplier.shippingMethods?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {supplier.shippingMethods.map((method, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            {method}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Not specified</p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Delivery Areas
                    </h4>
                    {supplier.deliveryAreas?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {supplier.deliveryAreas.map((area, index) => (
                          <span
                            key={index}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Not specified</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Terms */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <DollarSign className="text-purple-500" size={20} />
                  Payment Terms
                </h3>

                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-700 mb-1">Terms</h4>
                    <p className="text-gray-800">
                      {supplier.paymentTerms || "Not specified"}
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-700 mb-1">
                      Preferred Currency
                    </h4>
                    <p className="text-gray-800">
                      {supplier.preferredCurrency || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetail;
