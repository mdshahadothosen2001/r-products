import React from "react";

const statuses = [
  "start",
  "address",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function OrderStatusTracker({ currentStatus }) {
  const normalizedStatus = currentStatus?.toLowerCase(); 
  const currentIndex = statuses.indexOf(normalizedStatus);

  return (
    <div className="flex items-center justify-center space-x-6 mt-8 overflow-x-auto">
      {statuses.map((status, index) => {
        const isActive = index <= currentIndex && currentIndex !== -1;
        const isCurrent = status === normalizedStatus;
        const isCancelled = status === "cancelled" && isCurrent;

        return (
          <div key={status} className="flex flex-col items-center relative">
            {/* Circle or Square */}
            <div
              className={`w-12 h-12 flex items-center justify-center text-sm font-semibold border-2 transition-all
                ${
                  isCancelled
                    ? "bg-red-600 text-white border-red-600 rounded-md"  // square box (rounded-md instead of full)
                    : isCurrent
                    ? "bg-blue-600 text-white border-blue-600 rounded-full"
                    : isActive
                    ? "bg-white text-blue-600 border-blue-600 rounded-full"
                    : "bg-gray-200 text-gray-500 border-gray-400 rounded-full"
                }
              `}
            >
              {index + 1}
            </div>

            {/* Label */}
            <p
              className={`mt-2 text-xs font-medium ${
                isCancelled
                  ? "text-red-600 font-bold"
                  : isCurrent
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
