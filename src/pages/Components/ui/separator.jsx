export function Separator({ className = "", ...props }) {
  return <div className={`shrink-0 bg-border h-[1px] w-full my-4 ${className}`} {...props} />
}
