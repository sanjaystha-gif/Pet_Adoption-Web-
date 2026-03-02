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
    <div className="p-[2px] rounded-2xl bg-gradient-to-r from-pink-300 via-primary-600 to-accent-200">
      <div
        role="button"
        aria-label={`View ${pet.name} details`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="bg-card rounded-xl overflow-hidden transform hover:-translate-y-1 hover:shadow-bright transition-all duration-300 h-full flex flex-col"
      >
      {/* Image + overlay */}
      <div className="relative overflow-hidden">
        <div className="aspect-[4/3] w-full bg-gray-100 overflow-hidden">
          <img
            src={pet.images?.[0] || 'https://picsum.photos/seed/pet/800/600'}
            alt={pet.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Gradient overlay with name */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">{pet.name}</h3>
              <p className="text-sm text-white/90">{pet.breed} • {pet.ageDisplay}</p>
            </div>
            <div className="flex items-center gap-2">
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
        </div>

        {/* Favourite button */}
        <button
          onClick={handleFavouriteClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:scale-105 transition-transform"
          aria-label={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
          aria-pressed={isFavourited}
        >
          {isFavourited ? (
            <AiFillHeart size={20} className="text-error" aria-hidden="true" />
          ) : (
            <AiOutlineHeart size={20} className="text-primary-600" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="secondary" size="sm">{pet.gender === 'male' ? '♂️' : '♀️'} {pet.gender}</Badge>
            <Badge variant="secondary" size="sm">{pet.size}</Badge>
            {pet.vaccinated && <Badge variant="info" size="sm">Vaccinated</Badge>}
            {pet.neutered && <Badge variant="info" size="sm">Neutered</Badge>}
          </div>

          <p className="text-sm text-text-secondary mb-4"><FiMapPin size={14} className="inline mr-1" />{pet.location}</p>

          <p className="text-sm text-text-secondary line-clamp-3 mb-4">{pet.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => onMeetClick?.(pet.id)} variant="primary" size="sm" className="btn-gradient">Meet Me</Button>
          <Button onClick={() => onFavourite?.(pet.id)} variant="outline" size="sm" className="border-gray-300 text-gray-700">Message</Button>
        </div>
      </div>
      </div>
    </div>
  )
}
