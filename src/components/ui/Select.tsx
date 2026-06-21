import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({
  label,
  className = "",
  children,
  ...props
}: SelectProps) {
  return (
    <label className="flex flex-col gap-1">
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}

      <select
        className={`rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
