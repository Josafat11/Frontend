"use client"

import { useState } from "react"
import { useAuth } from "../../context/authContext";

const OrderTrackingPage = () => {
  const { theme } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [activeTab, setActiveTab] = useState("My Orders")

  // Datos de ejemplo para pedidos de autos
  const orders = [
    {
      id: "AUTO1254FD",
      totalPayment: "$45,000",
      paymentMethod: "Bank Transfer",
      estimatedDelivery: "15 Aug 2024",
      status: "accepted",
      statusText: "Your Order has been Accepted",
      items: [
        {
          name: "Toyota Camry 2024",
          image: "https://via.placeholder.com/60x60/4F46E5/FFFFFF?text=🚗",
          specs: "Hybrid | Automatic",
        },
        {
          name: "Extended Warranty",
          image: "https://via.placeholder.com/60x60/7C3AED/FFFFFF?text=🛡️",
          specs: "3 Years Coverage",
        },
        {
          name: "Premium Package",
          image: "https://via.placeholder.com/60x60/2563EB/FFFFFF?text=⭐",
          specs: "Leather Seats | GPS",
        },
      ],
      actions: ["Track Order", "Invoice", "Cancel Order"],
    },
    {
      id: "AUTO7412DF",
      totalPayment: "$32,500",
      paymentMethod: "Credit Card",
      deliveredDate: "28 July 2024",
      status: "delivered",
      statusText: "Your Order has been Delivered",
      items: [
        {
          name: "Honda Civic 2024",
          image: "https://via.placeholder.com/60x60/DC2626/FFFFFF?text=🚙",
          specs: "Sport | Manual",
        },
      ],
      actions: ["Add Review", "Invoice"],
    },
  ]
  
  const benefits = [
    {
      icon: "🚚",
      title: "Envío Gratis",
      description: "Envío gratis para pedidos mayores de $500",
    },
    {
      icon: "💳",
      title: "Pagos Flexibles",
      description: "Multiples opciones de pago seguros",
    },
    {
      icon: "🕐",
      title: "Tiempos Rápidos de Entrega",
      description: "Entrega en el mejor tiempo posible",
    },
  ]

  return (
    <div className={`min-h-screen ${
        theme === "dark"
          ? "bg-gray-800 text-gray-100"
          : "bg-gray-100 text-gray-900"}
        `}>
      <div className="py-10">
        <div className="px-4 mx-auto max-w-7xl">
          <h1 className={`mb-2 text-3xl font-bold text-center ${
            theme === "dark"
            ? "bg-gray-800 text-gray-100"
            : "bg-gray-100 text-gray-900"
          }`}> Seguimiento de Pedidos </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className={`px-4 py-8 mx-auto max-w-7xl rounded-2xl mb-14 ${
            theme === "dark"
            ? "bg-gray-600 text-gray-100"
            : "bg-gray-200 text-gray-900"
        }`}>
        <div className=" lg:grid-cols-4">
          {/* Orders Content */}
          <div className="lg:col-span-3">
            <div className={`rounded-lg shadow-sm ${
                theme === "dark"
                ? "bg-gray-600 text-gray-100"
                : "bg-gray-200 text-gray-900"
            }`}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className={`text-xl font-semibold ${
                    theme === "dark"
                    ? "bg-gray-600 text-gray-100"
                    : "bg-gray-200 text-gray-800"
                  }`}>
                    Pedidos
                    ({orders.length})
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${
                        theme === "dark"
                        ? "bg-gray-600 text-gray-100 font-semibold"
                        : "bg-gray-200 text-gray-900 font-semibold"
                    }`}> Mostrar por:</span>
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className={`px-3 py-1 text-sm border border-gray-300 rounded ${
                        theme === "dark"
                        ? "bg-gray-800 text-gray-100 font-semibold"
                        : "bg-gray-50 text-gray-900 font-semibold"
                      }`}
                    >
                      <option>Todos</option>
                      <option>Aceptados</option>
                      <option>Entregados</option>
                      <option>Cancelados</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {orders.map((order) => (
                  <div key={order.id} className="mb-8 last:mb-0">
                    {/* Order Header */}
                    <div className="p-4 mb-4 border border-yellow-200 rounded-lg bg-yellow-50">
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="block text-gray-600">Código de Orden</span>
                          <span className="font-semibold text-gray-800">#{order.id}</span>
                        </div>
                        <div>
                          <span className="block text-gray-600">Total a Pagar</span>
                          <span className="font-semibold text-gray-800">{order.totalPayment}</span>
                        </div>
                        <div>
                          <span className="block text-gray-600">Método de Pago</span>
                          <span className="font-semibold text-gray-800">{order.paymentMethod}</span>
                        </div>
                        <div>
                          <span className="block text-gray-600">
                            {order.status === "delivered" ? "Fecha de Entrega" : "Fecha Estimada de Entrega"}
                          </span>
                          <span className="font-semibold text-gray-800">
                            {order.status === "delivered" ? order.deliveredDate : order.estimatedDelivery}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4 space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="object-cover w-12 h-12 rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{item.name}</h4>
                            <p className="text-sm text-gray-600">{item.specs}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === "accepted" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {order.status === "accepted" ? "Accepted" : "Delivered"}
                        </span>
                        <span className={`${
                            theme === "dark"
                            ? "bg-gray-600 text-gray-300"
                            : "bg-gray-200 text-gray-700"
                         }`}> 
                         {order.statusText} 
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {order.actions.map((action) => (
                          <button
                            key={action}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              action === "Track Order" || action === "Add Review"
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : action === "Cancel Order"
                                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className={`py-12 ${
        theme === "dark"
        ? "bg-slate-700 text-gray-100"
        : "bg-slate-300 text-gray-900"
      }`}>
        <div className="px-4 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 text-2xl bg-yellow-100 rounded-full">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className={`mb-1 font-semibold ${
                    theme === "dark"
                    ? "bg-slate-700 text-gray-100"
                    : "bg-slate-300 text-gray-900"
                    }`}> 
                    {benefit.title}
                    </h3>
                  <p className={`text-sm text-gray-600" ${
                  theme === "dark"
                    ? "bg-slate-700 text-gray-300"
                    : "bg-slate-300 text-gray-800"
                  }`}> {benefit.description} </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderTrackingPage
