import React, { useEffect, useRef, useState } from 'react'
import { differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns'

interface CountdownTimerProps {
  targetDate: string
  className?: string
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, className = '' }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, isPast: false })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate)
      const now = new Date()

      if (target <= now) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, isPast: true })
        return
      }

      const days = differenceInDays(target, now)
      const hours = differenceInHours(target, now) % 24
      const minutes = differenceInMinutes(target, now) % 60
      setTimeLeft({ days, hours, minutes, isPast: false })
    }

    calculateTime()
    intervalRef.current = setInterval(calculateTime, 60000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [targetDate])

  if (timeLeft.isPast) {
    return (
      <span className={`text-[#a0a0a0] text-xs ${className}`}>
        Departed
      </span>
    )
  }

  if (timeLeft.days > 30) {
    return (
      <span className={`text-[#10b981] text-xs font-medium ${className}`}>
        {timeLeft.days} days to go
      </span>
    )
  }

  if (timeLeft.days > 0) {
    return (
      <span className={`text-[#f59e0b] text-xs font-medium ${className}`}>
        {timeLeft.days}d {timeLeft.hours}h until departure
      </span>
    )
  }

  return (
    <span className={`text-[#ec4899] text-xs font-medium animate-pulse ${className}`}>
      {timeLeft.hours}h {timeLeft.minutes}m until departure!
    </span>
  )
}
