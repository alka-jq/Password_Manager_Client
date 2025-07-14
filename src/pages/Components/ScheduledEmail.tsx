"use client"

import type React from "react"
import { useState } from "react"
import { Calendar } from "./ui/calendar"
import { Button } from "./ui/button"
import { Clock } from "lucide-react"
import { format, addDays, setHours, setMinutes, isBefore } from "date-fns"

interface ScheduleEmailProps {
  onSchedule: (scheduledTime: Date) => void
  onCancel: () => void
}

const ScheduleEmail: React.FC<ScheduleEmailProps> = ({ onSchedule, onCancel }) => {
  const now = new Date()
  const tomorrow = addDays(now, 1)
  tomorrow.setHours(8, 0, 0, 0)

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(tomorrow)
  const [selectedTime, setSelectedTime] = useState("08:00")

  // Generate time options in 30-minute intervals
  const timeOptions = []
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 30]) {
      const formattedHour = hour.toString().padStart(2, "0")
      const formattedMinute = minute.toString().padStart(2, "0")
      timeOptions.push(`${formattedHour}:${formattedMinute}`)
    }
  }

  const handleSchedule = () => {
    if (!selectedDate) return

    const [hours, minutes] = selectedTime.split(":").map(Number)
    const scheduledTime = new Date(selectedDate)
    scheduledTime.setHours(hours, minutes, 0, 0)

    // Ensure scheduled time is in the future
    if (isBefore(scheduledTime, new Date())) {
      alert("Please select a future date and time")
      return
    }

    onSchedule(scheduledTime)
  }

  // Quick schedule options
  const quickOptions = [
    {
      label: "Later today",
      time: setHours(setMinutes(new Date(), 0), now.getHours() + 3),
      show: now.getHours() < 21, // Only show if it's before 9 PM
    },
    {
      label: "Tomorrow morning",
      time: setHours(setMinutes(addDays(now, 1), 0), 8),
    },
    {
      label: "Tomorrow afternoon",
      time: setHours(setMinutes(addDays(now, 1), 0), 14),
    },
    {
      label: "Monday morning",
      time: (() => {
        const monday = new Date()
        monday.setDate(monday.getDate() + ((1 + 7 - monday.getDay()) % 7))
        monday.setHours(8, 0, 0, 0)
        return monday
      })(),
      show: now.getDay() !== 1, // Don't show if today is Monday
    },
  ]

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-md">
      <h2 className="text-lg font-semibold mb-4">Schedule Send</h2>
      <p className="text-sm text-gray-600 mb-4">Choose when you want your email to be sent</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Quick Schedule</h3>
          <div className="space-y-2">
            {quickOptions
              .filter((option) => option.show !== false)
              .map((option, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
                  onClick={() => {
                    setSelectedDate(option.time)
                    setSelectedTime(format(option.time, "HH:mm"))
                  }}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500">{format(option.time, "EEE, MMM d, h:mm a")}</div>
                </button>
              ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium text-sm mb-2">Custom Schedule</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date: Date) => isBefore(date, now)}
            className="rounded border p-2"
          />

          <div className="mt-4 flex items-center gap-2">
            <Clock size={16} className="text-gray-500" />
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="border rounded p-1 text-sm"
            >
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {format(
                    setHours(
                      setMinutes(new Date(), Number.parseInt(time.split(":")[1])),
                      Number.parseInt(time.split(":")[0]),
                    ),
                    "h:mm a",
                  )}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSchedule}>Schedule</Button>
      </div>
    </div>
  )
}

export default ScheduleEmail
