import React from 'react'
import { Card } from '../../components/ui/Card'

const AboutPage: React.FC = () => (
  <div className="container py-20">
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-primary">About PawBuddy</h1>
      <p className="text-text-secondary mt-2">We connect loving families with pets in need. Learn about our mission, values, and team.</p>
    </header>

    <div className="grid gap-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
        <p className="text-sm text-text-secondary">PawBuddy helps rescue dogs and cats find forever homes through a transparent, supportive adoption process.</p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-2">Our Team</h2>
        <p className="text-sm text-text-secondary">A small group of passionate volunteers and animal care professionals committed to pet welfare.</p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-2">Get Involved</h2>
        <p className="text-sm text-text-secondary">Volunteer, foster, or donate to support rescue operations and community outreach programs.</p>
      </Card>
    </div>
  </div>
)

export default AboutPage
