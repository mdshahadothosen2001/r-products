import React from "react";

const statuses = [
  "payment",
  "paid",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function OrderStatusTracker({ currentStatus }) {
  const normalizedStatus = currentStatus?.toLowerCase(); // ensure lowercase
  const currentIndex = statuses.indexOf(normalizedStatus);

  console.log("Current Status:", normalizedStatus, "Index:", currentIndex);

  return (
    <div className="flex items-center justify-center space-x-6 mt-8 overflow-x-auto">
      {statuses.map((status, index) => {
        const isActive = index <= currentIndex && currentIndex !== -1;
        const isCurrent = status === normalizedStatus;

        return (
          <div key={status} className="flex flex-col items-center relative">
            {/* Circle */}
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full text-sm font-semibold border-2 transition-all
                ${
                  isCurrent
                    ? "bg-blue-600 text-white border-blue-600" 
                    : isActive
                    ? "bg-white text-blue-600 border-blue-600"
                    : "bg-gray-200 text-gray-500 border-gray-400" 
                }
              `}
            >
              {index + 1}
            </div>

            {/* Label */}
            <p
              className={`mt-2 text-xs font-medium ${
                isCurrent
                  ? "text-blue-600 font-bold"
                  : isActive
                  ? "text-blue-600"
                  : "text-gray-600"
              }`}
            >
              {status.toUpperCase()}
            </p>

            {/* Connector Line */}
            {index < statuses.length - 1 && (
              <div
                className={`absolute top-6 left-full w-16 h-1 ${
                  index < currentIndex ? "bg-blue-600" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
