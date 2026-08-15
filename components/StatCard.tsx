import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-[#4ebdd5] text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-[#0096a5]">{value}</h3>
        {subtitle && (
          <p className="text-sm text-gray-400 mt-2 font-medium">{subtitle}</p>
        )}
      </div>
      {icon && (
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          {icon}
        </div>
      )}
    </div>
  );
}
