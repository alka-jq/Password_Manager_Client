"use client"

import React from "react"

export function RadioGroup({ value, onValueChange, className = "", children, ...props }) {
  return (
    <div className={className} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            checked: child.props.value === value,
            onChange: () => onValueChange(child.props.value),
          })
        }
        return child
      })}
    </div>
  )
}

export function RadioGroupItem({ value, id, checked, onChange, className = "", ...props }) {
  return (
    <input
      type="radio"
      id={id}
      value={value}
      checked={checked}
      onChange={onChange}
      className={`h-4 w-4 text-red-600 focus:ring-red-500 ${className}`}
      {...props}
    />
  )
}
