"use client"

import { useEffect, useState } from "react"
import { Users, BookOpen, Award, Globe } from "lucide-react"

const stats = [
  {
    value: 25000,
    label: "Developers",
    icon: Users,
  },
  {
    value: 150,
    label: "Roadmaps",
    icon: BookOpen,
  },
  {
    value: 5000,
    label: "Resources",
    icon: Globe,
  },
  {
    value: 98,
    label: "Success Rate",
    icon: Award,
    suffix: "%",
  },
]

export function StatsCounter() {
  const [counters, setCounters] = useState(stats.map(() => 0))
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("stats-section")
    if (element) observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!inView) return

    const duration = 2000 // ms
    const frameDuration = 1000 / 60 // 60fps
    const totalFrames = Math.round(duration / frameDuration)

    const countersInterval = setInterval(() => {
      setCounters((prevCounters) => {
        const newCounters = [...prevCounters]
        let completed = true

        stats.forEach((stat, index) => {
          // Calculate the increment per frame
          const increment = stat.value / totalFrames

          // If we haven't reached the target value yet
          if (newCounters[index] < stat.value) {
            newCounters[index] = Math.min(newCounters[index] + increment, stat.value)
            completed = false
          }
        })

        if (completed) clearInterval(countersInterval)
        return newCounters
      })
    }, frameDuration)

    return () => clearInterval(countersInterval)
  }, [inView])

  return (
    <div id="stats-section" className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
      {stats.map((stat, index) => (
        <div key={index} className="flex flex-col items-center justify-center text-center p-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <stat.icon className="w-6 h-6 text-primary" />
          </div>
          <div className="text-3xl md:text-4xl font-bold">
            {Math.round(counters[index]).toLocaleString()}
            {stat.suffix}
          </div>
          <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
