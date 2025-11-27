export default function FiledSet({ label = "", children }) {
  return (
    <div className="border border-[#dfdfdf] relative max-w-full">
      {label && (
        <div className="absolute -top-3.5 bg-white px-2 left-4 text-base font-bold">
          {label}
        </div>
      )}
      <div className="px-4 py-6 max-w-full">{children}</div>
    </div>
  );
}
