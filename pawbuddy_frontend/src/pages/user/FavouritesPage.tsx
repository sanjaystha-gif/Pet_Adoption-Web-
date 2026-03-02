import React from 'react'
import { useBooking } from '../../context/bookingStore'
import { usePets } from '../../context/petStore'
import { PetCard } from '../../components/pets/PetCard'

const FavouritesPage: React.FC = () => {
  const { favourites, removeFavourite } = useBooking()
  const { getAllPets } = usePets()

  const allPets = getAllPets()
  const favPets = allPets.filter(p => favourites.includes(p.id))

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold mb-6">My Favourites</h1>

      {favPets.length === 0 ? (
        <div className="bg-card p-6 rounded text-center">You have no favourites yet. Browse pets to add favourites.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favPets.map(p => (
            <div key={p.id}>
              <PetCard pet={p} isFavourited onFavourite={() => removeFavourite(p.id)} onMeetClick={() => {}} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FavouritesPage
