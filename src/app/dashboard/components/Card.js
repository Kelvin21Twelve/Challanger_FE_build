import { clsx } from "clsx";

export function Card({ label, value, color, isLoading }) {
  return (
    <div className="border rounded shadow-lg border-[#dfdfdf] py-6 px-5">
      <div className={clsx("uppercase font-bold text-sm pb-1", color)}>
        {label}
      </div>
      <div
        className={clsx(
          "font-bold text-xl",
          isLoading ? "p-3 mt-1 animate-pulse bg-gray-100" : "",
        )}
      >
        {isLoading ? "" : value}
      </div>
    </div>
  );
}
