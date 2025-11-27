export function ChartCardContainer({ children, label }) {
  return (
    <div className="border rounded shadow-lg border-[#dfdfdf]">
      <div className="p-3 border-b border-[#dfdfdf] text-[#007bff] font-bold bg-[#f7f7f7]">
        {label}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
