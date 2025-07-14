"use client"

import { useState } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"

const DAYS_OF_WEEK = ["S", "M", "T", "W", "T", "F", "S"]

export default function DateTimePicker() {
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 5, 11)) // June 11, 2025
  const [selectedTime, setSelectedTime] = useState("8:00 AM")
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 5, 1)) // June 2025

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Add padding days from previous and next month
  const startDay = monthStart.getDay()
  const endDay = monthEnd.getDay()

  const paddingStart = Array.from({ length: startDay }, (_, i) => {
    const date = new Date(monthStart)
    date.setDate(date.getDate() - (startDay - i))
    return date
  })

  const paddingEnd = Array.from({ length: 6 - endDay }, (_, i) => {
    const date = new Date(monthEnd)
    date.setDate(date.getDate() + (i + 1))
    return date
  })

  const allDays = [...paddingStart, ...calendarDays, ...paddingEnd]

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handleSave = () => {
    console.log("Selected date:", selectedDate)
    console.log("Selected time:", selectedTime)
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <div className="">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Pick Date & Time
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] p-0">
          <div className="bg-white rounded-lg p-6">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-semibold text-left">Pick date & time</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calendar Section */}
              <div className="space-y-4">
                {/* Month Navigation */}
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-teal-600">{format(currentMonth, "MMMM yyyy")}</h3>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={handlePreviousMonth} className="h-8 w-8 p-0">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleNextMonth} className="h-8 w-8 p-0">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Day Headers */}
                  {DAYS_OF_WEEK.map((day) => (
                    <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                      {day}
                    </div>
                  ))}

                  {/* Calendar Days */}
                  {allDays.map((date, index) => {
                    const isCurrentMonth = isSameMonth(date, currentMonth)
                    const isSelected = isSameDay(date, selectedDate)
                    const isTodayDate = isToday(date)

                    return (
                      <button
                        key={index}
                        onClick={() => handleDateSelect(date)}
                        className={cn(
                          "h-8 w-8 text-sm rounded-full flex items-center justify-center transition-colors",
                          {
                            "text-gray-300": !isCurrentMonth,
                            "text-gray-900": isCurrentMonth && !isSelected,
                            "bg-blue-500 text-white": isSelected,
                            "bg-gray-100": isTodayDate && !isSelected,
                            "hover:bg-gray-100": isCurrentMonth && !isSelected,
                          },
                        )}
                      >
                        {date.getDate()}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Date & Time Inputs Section */}
              <div className="space-y-4">
                <div>
                  <Input value={format(selectedDate, "MMM dd, yyyy")} readOnly className="w-full" />
                </div>

                <div>
                  <Input
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    placeholder="8:00 AM"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-4">
              <Button variant="ghost" onClick={handleCancel} className="text-blue-600 hover:text-blue-700">
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
