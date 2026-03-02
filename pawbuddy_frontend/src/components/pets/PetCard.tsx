import React from 'react'
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
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col"
    >
      {/* Image */}
      <div className="w-full bg-gray-100">
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img
            src={pet.images?.[0] || 'https://picsum.photos/seed/pet/800/600'}
            alt={pet.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-3 gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{pet.breed} • {pet.ageDisplay}</p>
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

          <p className="text-sm text-gray-600 mb-4 flex items-center gap-2"><FiMapPin size={14} />{pet.location}</p>

          <p className="text-sm text-gray-700 line-clamp-3 mb-4">{pet.description}</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <Button onClick={() => onMeetClick?.(pet.id)} variant="primary" size="sm" className="btn-gradient">Meet Me</Button>
            <Button onClick={() => onFavourite?.(pet.id)} variant="outline" size="sm">Message</Button>
          </div>

          <button
            onClick={handleFavouriteClick}
            className="p-2 rounded-full bg-white border border-gray-100 shadow-sm hover:scale-105 transition-transform"
            aria-label={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
            aria-pressed={isFavourited}
          >
            {isFavourited ? (
              <AiFillHeart size={18} className="text-red-500" aria-hidden="true" />
            ) : (
              <AiOutlineHeart size={18} className="text-gray-400" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
