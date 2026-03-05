import React from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { FiMapPin } from 'react-icons/fi'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import type { PetCardProps } from '../../types'

export const PetCard: React.FC<PetCardProps> = ({
  pet,
  onFavourite,
  isFavourited = false,
  onMeetClick,
  showStatus = true
}) => {
  const handleFavouriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onFavourite) onFavourite(pet.id)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Only trigger when the root container is focused (avoid interfering with inner buttons/links)
    if (e.currentTarget !== e.target) return
    if ((e.key === 'Enter' || e.key === ' ') && onMeetClick) {
      e.preventDefault()
      onMeetClick(pet.id)
    }
  }

  return (
    <article
      role="article"
      aria-label={`${pet.name} card`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden h-full flex flex-col"
    >
      {/* Image */}
      <div className="w-full bg-gradient-to-br from-orange-50 to-purple-50 dark:from-gray-700 dark:to-gray-600">
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img
            src={pet.images?.[0] || 'https://picsum.photos/seed/pet/800/600'}
            alt={pet.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-3 gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{pet.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{pet.breed} • {pet.ageDisplay}</p>
            </div>

            <div className="flex-shrink-0">
              {showStatus && (
                <Badge
                  variant={pet.status === 'available' ? 'success' : pet.status === 'pending' ? 'warning' : 'error'}
                  size="sm"
                >
                  {pet.status?.charAt(0).toUpperCase() + pet.status?.slice(1)}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="secondary" size="sm">{pet.gender === 'male' ? '♂️' : '♀️'} {pet.gender}</Badge>
            <Badge variant="secondary" size="sm">{pet.size}</Badge>
            {pet.vaccinated && <Badge variant="info" size="sm">Vaccinated</Badge>}
            {pet.neutered && <Badge variant="info" size="sm">Neutered</Badge>}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex items-center gap-2"><FiMapPin size={14} />{pet.location}</p>

          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-4">{pet.description}</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <Link to={`/pet/${pet.id}`} onClick={() => onMeetClick?.(pet.id)}>
              <Button variant="primary" size="sm">View Details</Button>
            </Link>
          </div>

          <button
            onClick={handleFavouriteClick}
            className="p-2.5 rounded-lg bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-700 dark:to-gray-600 hover:from-pink-100 hover:to-red-100 dark:hover:from-pink-900 dark:hover:to-red-900 transition-all duration-200 hover:scale-110"
            aria-label={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
            aria-pressed={isFavourited}
          >
            {isFavourited ? (
              <AiFillHeart size={20} className="text-red-500" aria-hidden="true" />
            ) : (
              <AiOutlineHeart size={20} className="text-gray-400" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
