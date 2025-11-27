import clsx from "clsx";
import Link from "next/link";

function ItemWrapper({ label, icon, isActive }) {
  return (
    <div
      className={clsx(
        "h-full px-3.5 text-sm text-center flex justify-center items-center",
        isActive ? "bg-[#0f65da]" : "",
      )}
    >
      <div>
        <div>
          <div
            title={label}
            className="inline-block [&_svg]:w-[20px] [&_svg]:h-[20px]"
          >
            {icon}
          </div>
        </div>
        <div className="leading-none pt-0.5 hidden xl:block">{label}</div>
      </div>
    </div>
  );
}

export default function HeaderItem({ path, subPath = "", onClick, ...rest }) {
  return path !== "#" ? (
    <Link href={path + subPath} className="h-full hidden lg:block">
      <ItemWrapper {...rest} />
    </Link>
  ) : (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer hidden lg:block"
    >
      <ItemWrapper {...rest} />
    </button>
  );
}
