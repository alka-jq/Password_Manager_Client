"use client"

export function Select({ children, value, onValueChange, ...props }) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    >
      {children}
    </select>
  )
}

export function SelectTrigger({ children, className = "", ...props }) {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  )
}

export function SelectValue({ children, placeholder, ...props }) {
  return <span {...props}>{children || placeholder}</span>
}

export function SelectContent({ children, ...props }) {
  return <div {...props}>{children}</div>
}

export function SelectItem({ children, value, ...props }) {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  )
}
