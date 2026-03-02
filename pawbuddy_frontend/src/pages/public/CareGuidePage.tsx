import React from 'react'
import { Card } from '../../components/ui/Card'

const CareGuidePage: React.FC = () => (
  <div className="container py-20">
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-primary">Pet Care Guide</h1>
      <p className="text-text-secondary mt-2">Practical tips to keep your new companion healthy and happy.</p>
    </header>

    <div className="grid gap-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-2">Nutrition</h2>
        <p className="text-sm text-text-secondary">Provide a balanced diet appropriate for your pet's age, size, and activity level. Consult your vet for dietary recommendations.</p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-2">Exercise & Enrichment</h2>
        <p className="text-sm text-text-secondary">Regular walks, play sessions, and toys help maintain physical and mental health.</p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-2">Grooming & Health</h2>
        <p className="text-sm text-text-secondary">Routine vet check-ups, vaccinations, and grooming keep your pet in top condition.</p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-2">Training & Socialization</h2>
        <p className="text-sm text-text-secondary">Start training early with positive reinforcement; socialize gradually for confident behavior.</p>
      </Card>
    </div>
  </div>
)

export default CareGuidePage
