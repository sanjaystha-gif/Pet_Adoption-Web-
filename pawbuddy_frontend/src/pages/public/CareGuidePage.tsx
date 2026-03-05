import React, { useEffect, useRef, useState } from 'react'
import {
  FiActivity,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiHeart,
  FiShield,
  FiSmile,
  FiTool,
  FiUsers
} from 'react-icons/fi'
import { Card } from '../../components/ui/Card'

const essentials = [
  {
    title: 'Nutrition',
    description: 'Use age-appropriate food, fixed meal times, and clean water available all day.',
    icon: FiHeart,
    tone: 'from-orange-100 to-amber-50'
  },
  {
    title: 'Exercise & Enrichment',
    description: 'Plan daily movement and puzzle play to reduce anxiety and destructive behavior.',
    icon: FiActivity,
    tone: 'from-sky-100 to-cyan-50'
  },
  {
    title: 'Grooming & Health',
    description: 'Brush regularly, maintain vaccination schedules, and book preventive checkups.',
    icon: FiShield,
    tone: 'from-emerald-100 to-teal-50'
  },
  {
    title: 'Training & Socialization',
    description: 'Use short positive sessions and controlled introductions to people and pets.',
    icon: FiUsers,
    tone: 'from-rose-100 to-orange-50'
  }
]

const weekPlan = [
  {
    day: 'Day 1',
    title: 'Safe Arrival',
    detail: 'Set up a quiet corner, introduce one room at a time, and keep routines simple.'
  },
  {
    day: 'Day 2-3',
    title: 'Routine Setup',
    detail: 'Establish feeding, potty/walk, and sleep times to build trust and predictability.'
  },
  {
    day: 'Day 4-5',
    title: 'Gentle Training',
    detail: 'Start name recall, sit, and reward calm behavior with treats and praise.'
  },
  {
    day: 'Day 6-7',
    title: 'Vet + Progress Review',
    detail: 'Do a health check, evaluate energy levels, and adjust food/activity if needed.'
  }
]

const checklist = [
  'ID tag and secure collar/harness',
  'Fresh water station in two spots',
  'Food transition plan for 7 days',
  'Comfort bed and chew-safe toys',
  'Emergency vet contacts saved',
  'Daily 15-30 min bonding time'
]

const CareGuidePage: React.FC = () => {
  const [visibleSections, setVisibleSections] = useState<number[]>([])
  const sectionRefs = useRef<Array<HTMLElement | null>>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const index = Number(entry.target.getAttribute('data-section-index'))
          setVisibleSections((prev) => (prev.includes(index) ? prev : [...prev, index]))
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    )

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const setSectionRef = (index: number) => (element: HTMLElement | null) => {
    sectionRefs.current[index] = element
  }

  const revealClass = (index: number) =>
    visibleSections.includes(index)
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-6 motion-reduce:opacity-100 motion-reduce:translate-y-0'

  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900">
      <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-orange-200/30 dark:bg-orange-900/20 blur-3xl" aria-hidden="true" />
      <div className="absolute top-36 -right-28 h-80 w-80 rounded-full bg-cyan-200/30 dark:bg-cyan-900/20 blur-3xl" aria-hidden="true" />

      <div className="container py-14 md:py-16 lg:py-20 relative z-10">
        <section
          ref={setSectionRef(0)}
          data-section-index={0}
          className={`rounded-3xl border border-orange-100 dark:border-orange-900 bg-gradient-to-br from-white via-orange-50/50 to-amber-50/70 dark:from-gray-800 dark:via-orange-900/30 dark:to-amber-900/30 p-6 md:p-10 shadow-xl shadow-orange-100/40 dark:shadow-orange-900/40 transition-all duration-700 ease-out motion-reduce:transition-none ${revealClass(0)}`}
        >
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 dark:border-orange-700 bg-white dark:bg-gray-800 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-700 dark:text-orange-300">
              <FiSmile className="h-4 w-4" />
              Care Guide
            </div>
            <h1 className="mt-4 text-3xl font-black leading-tight text-gray-900 dark:text-white md:text-5xl">
              Build A Happy Home For Your New Companion
            </h1>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-300 md:text-lg">
              Follow this practical plan for nutrition, safety, and training so your pet settles in quickly and confidently.
            </p>
          </div>

          <Card className="w-full max-w-sm border-orange-100 dark:border-orange-800 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm p-5">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Quick Start</p>
            <div className="mt-3 space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2"><FiClock className="text-orange-600" />Daily routine in 3 blocks</div>
              <div className="flex items-center gap-2"><FiTool className="text-orange-600" />Essential setup checklist</div>
              <div className="flex items-center gap-2"><FiCalendar className="text-orange-600" />First-week transition plan</div>
            </div>
          </Card>
        </div>
        </section>

        <section
          ref={setSectionRef(1)}
          data-section-index={1}
          className={`mt-10 transition-all duration-700 ease-out motion-reduce:transition-none ${revealClass(1)}`}
          style={{ transitionDelay: visibleSections.includes(1) ? '90ms' : '0ms' }}
        >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Essentials</h2>
          <span className="rounded-full bg-white/80 dark:bg-gray-800/80 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">4 key pillars</span>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {essentials.map((item, index) => {
            const Icon = item.icon
            return (
              <Card
                key={item.title}
                className="group p-0 overflow-hidden border border-gray-100 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-500"
                style={{ transitionDelay: visibleSections.includes(1) ? `${index * 70}ms` : '0ms' }}
              >
                <div className={`bg-gradient-to-r ${item.tone} dark:from-gray-700 dark:to-gray-600 px-5 py-4 border-b border-white/60 dark:border-gray-600`}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{item.description}</p>
                </div>
              </Card>
            )
          })}
        </div>
        </section>

        <section
          ref={setSectionRef(2)}
          data-section-index={2}
          className={`mt-10 grid gap-6 lg:grid-cols-2 transition-all duration-700 ease-out motion-reduce:transition-none ${revealClass(2)}`}
          style={{ transitionDelay: visibleSections.includes(2) ? '120ms' : '0ms' }}
        >
        <Card className="border border-gray-100 dark:border-gray-700 p-6 md:p-7">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">First 7 Days Plan</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">A calm onboarding schedule to reduce stress and speed up bonding.</p>
          <div className="mt-5 space-y-4">
            {weekPlan.map((step) => (
              <div key={step.day} className="rounded-xl border border-orange-100 dark:border-orange-800 bg-orange-50/40 dark:bg-orange-900/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-700 dark:text-orange-400">{step.day}</p>
                <h3 className="mt-1 text-base font-bold text-gray-900 dark:text-white">{step.title}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{step.detail}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border border-gray-100 dark:border-gray-700 p-6 md:p-7 bg-gradient-to-br from-white to-slate-50 dark:from-gray-800 dark:to-gray-900">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Safety Checklist</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Complete these items before and after adoption day.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {checklist.map((item) => (
              <div key={item} className="flex items-start gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
                <FiCheckCircle className="mt-0.5 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </Card>
        </section>
      </div>
    </div>
  )
}

export default CareGuidePage
