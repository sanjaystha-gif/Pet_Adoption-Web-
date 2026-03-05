import React, { useEffect, useRef, useState } from 'react'
import { Card } from '../../components/ui/Card'
import { FiHeart, FiUsers, FiHome, FiAward, FiTarget, FiShield, FiStar, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

const AboutPage: React.FC = () => {
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set())
  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = sectionsRef.current.indexOf(entry.target as HTMLElement)
          if (entry.isIntersecting && index !== -1) {
            setVisibleSections((prev) => new Set(prev).add(index))
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const stats = [
    { icon: FiHeart, label: 'Pets Adopted', value: '2,500+', color: 'text-rose-500' },
    { icon: FiUsers, label: 'Happy Families', value: '1,800+', color: 'text-blue-500' },
    { icon: FiHome, label: 'Partner Shelters', value: '45+', color: 'text-green-500' },
    { icon: FiAward, label: 'Years of Service', value: '8+', color: 'text-amber-500' }
  ]

  const values = [
    {
      icon: FiHeart,
      title: 'Compassion First',
      description: 'Every pet deserves love, care, and a second chance at happiness.',
      color: 'bg-rose-50 text-rose-600'
    },
    {
      icon: FiShield,
      title: 'Safety & Trust',
      description: 'Rigorous screening and transparent processes ensure the best matches.',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: FiTarget,
      title: 'Mission Driven',
      description: 'Committed to ending pet homelessness through education and action.',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: FiStar,
      title: 'Excellence',
      description: 'Providing exceptional support throughout every adoption journey.',
      color: 'bg-amber-50 text-amber-600'
    }
  ]

  const team = [
    {
      name: 'Sarah Mitchell',
      role: 'Founder & Director',
      image: 'https://res.cloudinary.com/dthfai8ky/image/upload/v1772740001/team1_placeholder.jpg',
      bio: 'Veterinarian with 15 years of experience in animal rescue and welfare.'
    },
    {
      name: 'Michael Chen',
      role: 'Operations Manager',
      image: 'https://res.cloudinary.com/dthfai8ky/image/upload/v1772740002/team2_placeholder.jpg',
      bio: 'Former shelter coordinator passionate about streamlining adoption processes.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Community Outreach',
      image: 'https://res.cloudinary.com/dthfai8ky/image/upload/v1772740003/team3_placeholder.jpg',
      bio: 'Building partnerships and organizing events to support pet adoption awareness.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        data-section-index="0"
        className={`relative bg-gradient-to-br from-primary via-primary-dark to-secondary text-white py-24 transition-all duration-700 ${
          visibleSections.has(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: visibleSections.has(0) ? '0ms' : '0ms' }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="text-sm font-medium">🐾 Est. 2016</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About PawBuddy
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Connecting loving families with pets in need. We're more than an adoption platform—we're a community dedicated to creating lifelong bonds between people and their perfect companions.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        data-section-index="1"
        className={`container mx-auto px-4 -mt-12 mb-20 transition-all duration-700 ${
          visibleSections.has(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: visibleSections.has(1) ? '100ms' : '0ms' }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <Card
                key={idx}
                className={`p-6 text-center hover:shadow-xl transition-all duration-300 ${
                  visibleSections.has(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: visibleSections.has(1) ? `${(idx + 1) * 100}ms` : '0ms' }}
              >
                <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Mission Statement */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        data-section-index="2"
        className={`container mx-auto px-4 mb-20 transition-all duration-700 ${
          visibleSections.has(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: visibleSections.has(2) ? '150ms' : '0ms' }}
      >
        <Card className="max-w-4xl mx-auto p-8 md:p-12 bg-gradient-to-br from-white to-gray-50">
          <div className="flex items-start gap-6">
            <div className="hidden md:block flex-shrink-0">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <FiTarget className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                PawBuddy exists to ensure no pet goes unloved. We bridge the gap between rescue animals and their forever families through a transparent, supportive adoption process that prioritizes the wellbeing of both pets and adopters.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Every year, millions of healthy, loving pets enter shelters. We're changing that narrative by making adoption accessible, joyful, and sustainable—one paw at a time.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Core Values */}
      <section
        ref={(el) => (sectionsRef.current[3] = el)}
        data-section-index="3"
        className={`container mx-auto px-4 mb-20 transition-all duration-700 ${
          visibleSections.has(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: visibleSections.has(3) ? '200ms' : '0ms' }}
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Our Core Values</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            The principles that guide every decision we make and every pet we help find a home.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, idx) => {
            const Icon = value.icon
            return (
              <Card
                key={idx}
                className={`p-6 hover:shadow-xl transition-all duration-300 ${
                  visibleSections.has(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: visibleSections.has(3) ? `${(idx + 1) * 100}ms` : '0ms' }}
              >
                <div className={`w-14 h-14 rounded-xl ${value.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Team Section */}
      <section
        ref={(el) => (sectionsRef.current[4] = el)}
        data-section-index="4"
        className={`bg-gradient-to-b from-gray-50 to-white py-20 transition-all duration-700 ${
          visibleSections.has(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: visibleSections.has(4) ? '250ms' : '0ms' }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A passionate group of animal advocates, veterinarians, and volunteers dedicated to making a difference.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, idx) => (
              <Card
                key={idx}
                className={`overflow-hidden hover:shadow-xl transition-all duration-300 ${
                  visibleSections.has(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: visibleSections.has(4) ? `${(idx + 1) * 100}ms` : '0ms' }}
              >
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <FiUsers className="w-24 h-24 text-primary/40" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved CTA */}
      <section
        ref={(el) => (sectionsRef.current[5] = el)}
        data-section-index="5"
        className={`container mx-auto px-4 py-20 transition-all duration-700 ${
          visibleSections.has(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: visibleSections.has(5) ? '300ms' : '0ms' }}
      >
        <Card className="max-w-4xl mx-auto p-8 md:p-12 bg-gradient-to-br from-primary to-primary-dark text-white">
          <div className="text-center">
            <FiStar className="w-12 h-12 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl font-bold mb-4">Get Involved</h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
              Join our mission to create a world where every pet has a loving home. Whether you adopt, volunteer, foster, or donate—you're making a real impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/adopt"
                className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
              >
                Adopt a Pet
              </a>
              <a
                href="mailto:volunteer@pawbuddy.com"
                className="px-8 py-3 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-semibold rounded-lg hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
              >
                Become a Volunteer
              </a>
            </div>

            <div className="mt-12 pt-8 border-t border-white/20">
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-white/80">
                <div className="flex items-center gap-2">
                  <FiMail className="w-5 h-5" />
                  <span>info@pawbuddy.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="w-5 h-5" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin className="w-5 h-5" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

export default AboutPage
