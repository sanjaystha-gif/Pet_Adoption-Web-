import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { PetCard } from '../../components/pets/PetCard'
import { usePets } from '../../context/petStore'
import { useBooking } from '../../context/bookingStore'
import { useAuth } from '../../context/authStore'
import type { Pet } from '../../types'
import { AiOutlineStar } from 'react-icons/ai'
import { buildCloudinaryUrl } from '../../utils/cloudinary'

const HomePage: React.FC = () => {
  const { pets, getAllPets } = usePets()
  const { toggleFavourite, favourites } = useBooking()
  const { isAuthenticated } = useAuth()
  const [featured, setFeatured] = useState<Pet[]>([])

  useEffect(() => {
    const allPets = getAllPets()
    setFeatured(allPets.filter((pet) => pet.status === 'available').slice(0, 6))
  }, [pets, getAllPets])

  const handleMeetClick = (_petId: string) => {
  }

  return (
    <div className="page-enter">
      <section className="relative overflow-hidden">
        <div className="container py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
                Find Your
                <br />
                <span className="logo-gradient">perfect companion</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Browse adoptable dogs and cats, learn about pet care, and start the adoption process with confidence.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/adopt">
                  <Button variant="primary" size="lg">Adopt Now</Button>
                </Link>
                <Link to="/care-guide">
                  <Button variant="outline" size="lg">Care Guide</Button>
                </Link>
              </div>
              <div className="mt-6 text-sm text-gray-500">Trusted by shelters and adopters across the country.</div>
            </div>

            <div className="flex justify-center">
              <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-lg">
                <img src={buildCloudinaryUrl('dog-1')} alt="Happy pet" className="w-full h-[420px] object-cover" />
                <div className="absolute -bottom-6 -right-6 w-44 h-44 rounded-lg bg-white/80 backdrop-blur p-3 flex items-center justify-center text-sm font-medium">
                  Meet friendly pets near you
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard number="500+" label="Pets Adopted" />
            <StatCard number="1,200+" label="Happy Families" />
            <StatCard number="50+" label="Breeds Available" />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Meet Our Furry Friends
            </h2>
            <p className="text-lg text-text-secondary">
              Browse some of our available pets looking for their forever homes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featured.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                isFavourited={favourites.includes(pet.id)}
                onFavourite={() => {
                  if (isAuthenticated) {
                    toggleFavourite(pet.id)
                  }
                }}
                onMeetClick={() => handleMeetClick(pet.id)}
              />
            ))}
          </div>

          <div className="text-center">
            <Link to="/adopt">
              <Button variant="outline" size="lg">
                View All Pets
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-secondary-50 py-20">
        <div className="container">
          <h2 className="text-4xl font-bold text-primary text-center mb-16">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProcessCard number="1" title="Browse" description="Explore our collection of available dogs and cats" />
            <ProcessCard number="2" title="Apply" description="Submit an adoption request with your information" />
            <ProcessCard number="3" title="Adopt" description="Get approved and bring your new friend home!" />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <h2 className="text-4xl font-bold text-primary text-center mb-16">
            Why Choose PawBuddy?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon="✓" title="Verified Pets" description="All pets are health-checked and verified" />
            <FeatureCard icon="🛡️" title="Safe Process" description="Secure and transparent adoption process" />
            <FeatureCard icon="👥" title="Support Team" description="Expert support throughout your journey" />
            <FeatureCard icon="💬" title="Free Consultation" description="Get expert advice before adoption" />
          </div>
        </div>
      </section>

      <section className="bg-secondary-50 py-20">
        <div className="container">
          <h2 className="text-4xl font-bold text-primary text-center mb-16">
            Happy Stories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah Johnson"
              text="Finding Max through PawBuddy was the best decision! He's brought so much joy to our family."
              rating={5}
            />
            <TestimonialCard
              name="Michael Chen"
              text="The team was incredibly helpful throughout the entire adoption process. Highly recommended!"
              rating={5}
            />
            <TestimonialCard
              name="Emma Wilson"
              text="Luna is the perfect companion. PawBuddy made everything so easy and stress-free."
              rating={5}
            />
          </div>
        </div>
      </section>

      <section className="bg-primary-600 text-white py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated
            </h2>
            <p className="mb-8">
              Subscribe to our newsletter for new pet arrivals and adoption tips
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full text-primary"
              />
              <Button variant="secondary" size="md">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

interface StatCardProps {
  number: string
  label: string
}

const StatCard: React.FC<StatCardProps> = ({ number, label }) => (
  <div className="text-center">
    <p className="text-4xl font-bold text-primary-600 mb-2">{number}</p>
    <p className="text-lg text-text-secondary">{label}</p>
  </div>
)

interface ProcessCardProps {
  number: string
  title: string
  description: string
}

const ProcessCard: React.FC<ProcessCardProps> = ({ number, title, description }) => (
  <Card className="text-center">
    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <span className="text-2xl font-bold text-primary-600">{number}</span>
    </div>
    <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
    <p className="text-text-secondary">{description}</p>
  </Card>
)

interface FeatureCardProps {
  icon: string
  title: string
  description: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <Card>
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-lg font-bold text-primary mb-2">{title}</h3>
    <p className="text-text-secondary text-sm">{description}</p>
  </Card>
)

interface TestimonialCardProps {
  name: string
  text: string
  rating: number
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, text, rating }) => (
  <Card>
    <div className="flex gap-1 mb-4">
      {[...Array(rating)].map((_, index) => (
        <AiOutlineStar key={index} size={20} className="fill-yellow-400 text-yellow-400" />
      ))}
    </div>
    <p className="text-text-secondary mb-4 italic">"{text}"</p>
    <p className="font-semibold text-primary">{name}</p>
  </Card>
)

export default HomePage
