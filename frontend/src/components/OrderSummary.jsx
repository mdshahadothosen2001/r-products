import React from "react";

export default function OrderSummaryPro({ order }) {
  return (
    <div className="max-w-5xl mx-auto py-10 space-y-12">

      {/* ✅ Header */}
      <section className="border-b pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="text-gray-500">Status</p>
            <p className="text-lg font-semibold capitalize">{order.status}</p>
          </div>
          <div>
            <p className="text-gray-500">Order ID</p>
            <p className="text-lg font-semibold">#{order.id}</p>
          </div>
          <div>
            <p className="text-gray-500">Date</p>
            <p className="text-lg font-semibold">
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500">COD</p>
            <p className="text-lg font-semibold text-green-600">
              {order.total_price} BDT
            </p>
          </div>
        </div>
      </section>

      {/* ✅ Sender Info */}
      <section className="border-b pb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Sender Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <p><span className="text-gray-500">Name:</span> {order.sender_info?.name}</p>
          <p><span className="text-gray-500">Email:</span> {order.sender_info?.email}</p>
          <p><span className="text-gray-500">Phone:</span> {order.sender_info?.phone}</p>
        </div>
      </section>

      {/* ✅ Receiver Info */}
      <section className="border-b pb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Receiver Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-medium">
              {order.receiver_info?.first_name} {order.receiver_info?.last_name}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-medium">{order.receiver_info?.phone}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-500">Address</p>
            <p className="font-medium">
              {order.receiver_info?.address_line_1},{" "}
              {order.receiver_info?.address_line_2},{" "}
              {order.receiver_info?.city},{" "}
              {order.receiver_info?.postal_or_zip_code}
            </p>
          </div>
        </div>
      </section>

      {/* ✅ Product Information */}
      <section>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Product Information</h3>
        {order.items?.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm">
                  <th className="p-3 border">Product</th>
                  <th className="p-3 border">Quantity</th>
                  <th className="p-3 border">Price</th>
                  <th className="p-3 border">Total</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {order.items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 border">{item.product_name}</td>
                    <td className="p-3 border">{item.quantity}</td>
                    <td className="p-3 border">৳{item.price}</td>
                    <td className="p-3 border font-semibold text-gray-800">
                      ৳{item.price * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
