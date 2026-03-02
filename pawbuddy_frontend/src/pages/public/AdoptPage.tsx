import React, { useMemo, useState } from 'react'
import { PetCard } from '../../components/pets/PetCard'
import { usePets } from '../../context/petStore'
import { useBooking } from '../../context/bookingStore'
import { useAuth } from '../../context/authStore'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import type { PetFilters } from '../../types'

const AdoptPage: React.FC = () => {
  const { getAllPets, filterPets } = usePets()
  const { favourites, toggleFavourite } = useBooking()
  const { isAuthenticated } = useAuth()

  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<Partial<PetFilters>>({})
  const [sortBy, setSortBy] = useState('newest')

  const allPets = getAllPets()

  const breeds = useMemo(() => {
    const setB = new Set<string>()
    allPets.forEach(p => setB.add(p.breed))
    return Array.from(setB).sort()
  }, [allPets])

  const filtered = useMemo(() => {
    let results = query ? allPets.filter(p => [p.name, p.breed, p.location].some(f => f.toLowerCase().includes(query.toLowerCase()))) : allPets
    results = filterPets(filters as PetFilters).filter(p => results.some(r => r.id === p.id))
    // only show available or pending (exclude adopted)
    results = results.filter(p => p.status !== 'adopted')
    return results
  }, [allPets, query, filters, filterPets])

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <div className="bg-card p-4 rounded-xl">
            <h3 className="font-semibold mb-3">Filters</h3>
            <div className="mb-3">
              <label className="block text-sm mb-1">Type</label>
              <div className="flex gap-2">
                <Button variant={filters.type === 'dog' ? 'primary' : 'outline'} size="sm" onClick={() => setFilters(f => ({ ...f, type: f?.type === 'dog' ? undefined : 'dog' }))}>Dogs</Button>
                <Button variant={filters.type === 'cat' ? 'primary' : 'outline'} size="sm" onClick={() => setFilters(f => ({ ...f, type: f?.type === 'cat' ? undefined : 'cat' }))}>Cats</Button>
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1">Breed</label>
              <Select
                value={filters.breed ?? ''}
                onChange={(e) => setFilters(f => ({ ...f, breed: e.target.value || undefined }))}
                options={[{ value: '', label: 'All' }, ...breeds.map(b => ({ value: b, label: b }))]}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1">Location</label>
              <Input value={filters.location ?? ''} onChange={(e) => setFilters(f => ({ ...f, location: e.target.value || undefined }))} placeholder="City" />
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="md" onClick={() => { setFilters({}); setQuery('') }}>Clear Filters</Button>
              <Button variant="primary" size="md" onClick={() => { /* no-op, UI only */ }}>Apply</Button>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Input placeholder="Search pets by name, breed, location" value={query} onChange={(e) => setQuery(e.target.value)} />
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} options={[{ value: 'newest', label: 'Newest' }, { value: 'oldest', label: 'Oldest' }, { value: 'name-asc', label: 'Name A-Z' }, { value: 'name-desc', label: 'Name Z-A' }]} />
            </div>
            <div className="text-sm text-text-secondary">Showing {filtered.length} pets</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(pet => (
              <PetCard key={pet.id} pet={pet} isFavourited={favourites.includes(pet.id)} onFavourite={() => { if (isAuthenticated) toggleFavourite(pet.id) }} onMeetClick={() => { /* navigate to detail handled internally */ }} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdoptPage
