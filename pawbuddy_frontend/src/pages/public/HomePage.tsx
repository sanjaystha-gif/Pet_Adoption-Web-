import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { PetCard } from '../../components/pets/PetCard'
import { usePets } from '../../context/petStore'
import { useBooking } from '../../context/bookingStore'
import { useAuth } from '../../context/authStore'
import type { Pet } from '../../types'
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
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-purple-50 py-20 relative overflow-hidden" style={{backgroundImage: 'url(https://res.cloudinary.com/dthfai8ky/image/upload/v1772459205/Ellipse_23_fptx65.png)', backgroundPosition: '70% center', backgroundRepeat: 'no-repeat', backgroundSize: '30%'}}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Find Your <span className="text-primary">Perfect Pet</span>
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Browse adorable dogs and cats looking for loving homes. Start your adoption journey today.
              </p>
              <div className="flex gap-3">
                <Link to="/adopt">
                  <Button variant="primary" size="lg">Browse Pets</Button>
                </Link>
                <Link to="/care-guide">
                  <Button variant="outline" size="lg">Learn More</Button>
                </Link>
              </div>
            </div>

            <div className="flex justify-center">
              <img src="https://res.cloudinary.com/dthfai8ky/image/upload/v1772459162/image_167_4_ovm61a.png" alt="Happy pet" className="w-full max-w-md h-[400px] object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Available Pets */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              Available Pets
            </h2>
            <p className="text-lg text-gray-600">
              Meet some of our pets looking for their forever homes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
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

      {/* How It Works */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-orange-50 py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <ProcessCard number="1" title="Browse Pets" description="Find your perfect companion from our available pets" />
            <ProcessCard number="2" title="Submit Request" description="Fill out an adoption application form" />
            <ProcessCard number="3" title="Take Home" description="Meet your pet and complete the adoption" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <StatCard number="500+" label="Pets Adopted" />
            <StatCard number="1,200+" label="Happy Families" />
            <StatCard number="50+" label="Partner Shelters" />
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
    <p className="text-4xl font-bold text-primary mb-2">{number}</p>
    <p className="text-gray-600">{label}</p>
  </div>
)

interface ProcessCardProps {
  number: string
  title: string
  description: string
}

const ProcessCard: React.FC<ProcessCardProps> = ({ number, title, description }) => (
  <div className="text-center">
    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
      <span className="text-2xl font-bold">{number}</span>
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
)

export default HomePage
