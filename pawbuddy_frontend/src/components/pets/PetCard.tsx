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
    <div
      role="button"
      aria-label={`View ${pet.name} details`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="bg-card rounded-2xl shadow-branded overflow-hidden hover:shadow-hover transition-all duration-300 h-full flex flex-col"
    >
      {/* Image Container */}
      <div className="relative h-56 bg-gray-200 overflow-hidden">
        <img
          src={pet.images?.[0] || 'https://picsum.photos/400/300?random'}
          alt={pet.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />

        {/* Status Badge */}
        {showStatus && (
          <div className="absolute top-4 left-4">
            <Badge
              variant={
                pet.status === 'available'
                  ? 'success'
                  : pet.status === 'pending'
                  ? 'warning'
                  : 'error'
              }
              size="sm"
            >
              {pet.status?.charAt(0).toUpperCase() + pet.status?.slice(1)}
            </Badge>
          </div>
        )}

        {/* Favourite Button */}
        <button
          onClick={handleFavouriteClick}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all"
          aria-label={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
          aria-pressed={isFavourited}
        >
          {isFavourited ? (
            <AiFillHeart size={20} className="text-error" aria-hidden="true" />
          ) : (
            <AiOutlineHeart size={20} className="text-text-secondary" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Name and Age */}
        <h3 className="font-bold text-lg text-primary mb-1">{pet.name}</h3>
        <p className="text-sm text-text-secondary mb-3">
          {pet.breed} • {pet.ageDisplay}
        </p>

        {/* Gender and Size */}
        <div className="flex gap-2 mb-3">
          <Badge variant="secondary" size="sm">
            {pet.gender === 'male' ? '♂️' : '♀️'} {pet.gender}
          </Badge>
          <Badge variant="secondary" size="sm">
            {pet.size}
          </Badge>
        </div>

        {/* Health Info */}
        <div className="flex gap-2 mb-3 text-xs">
          {pet.vaccinated && (
            <span className="text-accent">
              ✓ Vaccinated
            </span>
          )}
          {pet.neutered && (
            <span className="text-accent">
              ✓ Neutered
            </span>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-text-secondary mb-4">
          <FiMapPin size={16} />
          <span>{pet.location}</span>
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => onMeetClick?.(pet.id)}
          variant="primary"
          size="sm"
          fullWidth
          aria-label={`Request to meet ${pet.name}`}
        >
          Meet Me
        </Button>
      </div>
    </div>
  )
}
