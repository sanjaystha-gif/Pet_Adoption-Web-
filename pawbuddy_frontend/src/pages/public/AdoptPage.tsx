import React, { useMemo, useState } from 'react'
import { PetCard } from '../../components/pets/PetCard'
import { usePets } from '../../context/petStore'
import { useBooking } from '../../context/bookingStore'
import { useAuth } from '../../context/authStore'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import type { PetFilters } from '../../types'

// Color mapping
const colorMap: Record<string, string> = {
  'Black': '#1F2937',
  'White': '#F5F5F5',
  'Brown': '#92400E',
  'Golden': '#D97706',
  'Red': '#DC2626',
  'Gray': '#9CA3AF',
  'Orange': '#EA580C',
  'Cream': '#FEF3C7',
  'Tan': '#D2B48C',
  'Chocolate': '#6B4423',
  'Spotted': '#E5E7EB',
  'Striped': '#D1D5DB',
  'Merle': '#A1A5A8',
}

const AdoptPage: React.FC = () => {
  const { getAllPets, filterPets, getAvailablePets } = usePets()
  const { favourites, toggleFavourite } = useBooking()
  const { isAuthenticated } = useAuth()

  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<Partial<PetFilters>>({})
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [gender, setGender] = useState<string>('')
  const [ageRange, setAgeRange] = useState<string>('')
  const [color, setColor] = useState<string>('')

  const allPets = getAllPets()

  const breeds = useMemo(() => {
    const setB = new Set<string>()
    allPets.forEach(p => setB.add(p.breed))
    return Array.from(setB).sort()
  }, [allPets])

  const colors = useMemo(() => {
    const setC = new Set<string>()
    allPets.forEach(p => {
      if (p.color) setC.add(p.color)
    })
    return Array.from(setC).sort()
  }, [allPets])

  const ages = useMemo(() => {
    const ageMap = new Map<string, string>()
    allPets.forEach(p => {
      if (p.age) {
        const ageNum = typeof p.age === 'string' ? parseInt(p.age) : p.age
        if (ageNum < 1) ageMap.set('baby', 'Baby (< 1 year)')
        else if (ageNum < 3) ageMap.set('young', 'Young (1-3 years)')
        else if (ageNum < 7) ageMap.set('adult', 'Adult (3-7 years)')
        else ageMap.set('senior', 'Senior (7+ years)')
      }
    })
    return Array.from(ageMap.entries()).map(([key, label]) => ({ key, label }))
  }, [allPets])

  const petStats = useMemo(() => {
    const available = allPets.filter(p => p.status === 'available')
    const dogs = available.filter(p => p.type === 'dog').length
    const cats = available.filter(p => p.type === 'cat').length
    return { available: available.length, dogs, cats }
  }, [allPets])

  const filtered = useMemo(() => {
    let results = query ? allPets.filter(p => [p.name, p.breed, p.location].some(f => f.toLowerCase().includes(query.toLowerCase()))) : allPets
    results = filterPets(filters as PetFilters).filter(p => results.some(r => r.id === p.id))
    results = results.filter(p => p.status !== 'adopted')
    
    // Apply gender filter
    if (gender) {
      results = results.filter(p => p.gender?.toLowerCase() === gender.toLowerCase())
    }

    // Apply color filter
    if (color) {
      results = results.filter(p => p.color?.toLowerCase() === color.toLowerCase())
    }

    // Apply age range filter
    if (ageRange) {
      results = results.filter(p => {
        if (!p.age) return false
        const ageNum = typeof p.age === 'string' ? parseInt(p.age) : p.age
        switch (ageRange) {
          case 'baby': return ageNum < 1
          case 'young': return ageNum >= 1 && ageNum < 3
          case 'adult': return ageNum >= 3 && ageNum < 7
          case 'senior': return ageNum >= 7
          default: return true
        }
      })
    }
    
    // Apply sorting
    if (sortBy === 'name-asc') {
      results.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'name-desc') {
      results.sort((a, b) => b.name.localeCompare(a.name))
    }
    
    return results
  }, [allPets, query, filters, filterPets, sortBy, gender, color, ageRange])

  const hasActiveFilters = Object.values(filters).some(v => v) || gender || color || ageRange

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-500 via-purple-500 to-pink-500 dark:from-orange-600 dark:via-purple-600 dark:to-pink-600 text-white py-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-6xl font-black mb-4 leading-tight">
              🐾 Find Your Perfect Companion
            </h1>
            <p className="text-orange-100 text-xl mb-8 font-medium">
              Discover {petStats.available} loving pets waiting for their forever homes. Start your adoption journey today!
            </p>
          </div>
          
          {/* Quick Stats - Enhanced */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center border border-white/30 hover:bg-white/30 transition-all">
              <p className="text-4xl font-black">{petStats.available}</p>
              <p className="text-sm text-orange-100 font-semibold mt-2">Pets Available</p>
              <p className="text-xs text-orange-200 mt-1">Waiting for love</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center border border-white/30 hover:bg-white/30 transition-all">
              <p className="text-4xl font-black">{petStats.dogs}</p>
              <p className="text-sm text-orange-100 font-semibold mt-2">Dogs</p>
              <p className="text-xs text-orange-200 mt-1">Furry friends</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center border border-white/30 hover:bg-white/30 transition-all">
              <p className="text-4xl font-black">{petStats.cats}</p>
              <p className="text-sm text-orange-100 font-semibold mt-2">Cats</p>
              <p className="text-xs text-orange-200 mt-1">Adorable kitties</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-orange-200 dark:bg-gray-800 dark:border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎨</span>
                    <h3 className="font-black text-xl text-gray-900 dark:text-white">Smart Filters</h3>
                  </div>
                  {hasActiveFilters && (
                    <button
                      onClick={() => { 
                        setFilters({}); 
                        setQuery('');
                        setGender('');
                        setColor('');
                        setAgeRange('');
                      }}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-3 py-1.5 rounded-lg transition-all hover:bg-orange-100"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Divider */}
                <div className="h-1 bg-gradient-to-r from-orange-200 to-purple-200 rounded-full mb-8"></div>

                {/* Pet Type Filter */}
                <div className="mb-8">
                  <label className="block text-sm font-black text-gray-900 dark:text-white mb-3 uppercase tracking-wide">What are you looking for?</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setFilters(f => ({ ...f, type: f?.type === 'dog' ? undefined : 'dog' }))}
                      className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${
                        filters.type === 'dog'
                          ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg scale-105'
                          : 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 hover:border-orange-400 hover:shadow-md'
                      }`}
                    >
                      🐕 Dogs
                    </button>
                    <button
                      onClick={() => setFilters(f => ({ ...f, type: f?.type === 'cat' ? undefined : 'cat' }))}
                      className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${
                        filters.type === 'cat'
                          ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white shadow-lg scale-105'
                          : 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 hover:border-purple-400 hover:shadow-md'
                      }`}
                    >
                      🐱 Cats
                    </button>
                  </div>
                </div>

                {/* Breed Filter */}
                <div className="mb-8">
                  <label className="block text-sm font-black text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Breed</label>
                  <Select
                    value={filters.breed ?? ''}
                    onChange={(e) => setFilters(f => ({ ...f, breed: e.target.value || undefined }))}
                    options={[{ value: '', label: '👉 All Breeds' }, ...breeds.map(b => ({ value: b, label: `▸ ${b}` }))]}
                  />
                </div>

                {/* Gender Filter */}
                <div className="mb-8">
                  <label className="block text-sm font-black text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Gender</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setGender(gender === 'male' ? '' : 'male')}
                      className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${
                        gender === 'male'
                          ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg scale-105'
                          : 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 hover:shadow-md'
                      }`}
                    >
                      ♂️ Male
                    </button>
                    <button
                      onClick={() => setGender(gender === 'female' ? '' : 'female')}
                      className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${
                        gender === 'female'
                          ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-lg scale-105'
                          : 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 hover:border-pink-400 hover:shadow-md'
                      }`}
                    >
                      ♀️ Female
                    </button>
                  </div>
                </div>

                {/* Age Range Filter */}
                <div className="mb-8">
                  <label className="block text-sm font-black text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Age Range</label>
                  <Select
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value)}
                    options={[
                      { value: '', label: 'All Ages' },
                      { value: 'baby', label: 'Baby (< 1 year)' },
                      { value: 'young', label: 'Young (1-3 years)' },
                      { value: 'adult', label: 'Adult (3-7 years)' },
                      { value: 'senior', label: 'Senior (7+ years)' }
                    ]}
                  />
                </div>

                {/* Color Filter */}
                <div className="mb-8">
                  <label className="block text-sm font-black text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Color</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {colors.map(c => (
                      <button
                        key={c}
                        onClick={() => setColor(color === c ? '' : c)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 ${
                          color === c
                            ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 ring-2 ring-orange-300 shadow-md'
                            : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 bg-white dark:bg-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white dark:hover:from-gray-600 dark:hover:to-gray-700'
                        }`}
                      >
                        <div
                          className="w-7 h-7 rounded-lg border-2 border-gray-400 dark:border-gray-500 flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: colorMap[c] || '#E5E7EB' }}
                        />
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex-1 text-left">{c}</span>
                        {color === c && <span className="text-orange-600 dark:text-orange-400 font-bold text-lg">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div className="mb-8">
                  <label className="block text-sm font-black text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Location</label>
                  <Input 
                    value={filters.location ?? ''} 
                    onChange={(e) => setFilters(f => ({ ...f, location: e.target.value || undefined }))} 
                    placeholder="📍 Enter city..." 
                  />
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-l-4 border-blue-500 dark:border-blue-400 rounded-r-xl p-4 mb-6">
                    <p className="text-xs font-black text-blue-900 dark:text-blue-200 mb-3 uppercase">ACTIVE FILTERS:</p>
                    <div className="flex flex-wrap gap-2">
                      {filters.type && (
                        <span className="px-3 py-1 bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-100 text-xs font-bold rounded-full">
                          {filters.type === 'dog' ? '🐕 Dogs' : '🐱 Cats'} ✕
                        </span>
                      )}
                      {filters.breed && (
                        <span className="px-3 py-1 bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-100 text-xs font-bold rounded-full">
                          {filters.breed} ✕
                        </span>
                      )}
                      {filters.location && (
                        <span className="px-3 py-1 bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-100 text-xs font-bold rounded-full">
                          📍 {filters.location} ✕
                        </span>
                      )}
                      {gender && (
                        <span className="px-3 py-1 bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-100 text-xs font-bold rounded-full">
                          {gender === 'male' ? '♂️ Male' : '♀️ Female'} ✕
                        </span>
                      )}
                      {color && (
                        <span className="px-3 py-1 bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-100 text-xs font-bold rounded-full">
                          🎨 {color} ✕
                        </span>
                      )}
                      {ageRange && (
                        <span className="px-3 py-1 bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-100 text-xs font-bold rounded-full">
                          📅 {ages.find(a => a.key === ageRange)?.label} ✕
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Clear Button */}
                <Button 
                  variant="primary" 
                  onClick={() => { 
                    setFilters({}); 
                    setQuery('');
                    setGender('');
                    setColor('');
                    setAgeRange('');
                  }}
                  className="w-full font-bold py-3 text-lg"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Toolbar */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                <div className="flex-1">
                  <Input 
                    placeholder="🔍 Search by name, breed, or location..." 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)}
                    className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all font-semibold"
                  />
                </div>
                
                <Select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)} 
                  options={[
                    { value: 'newest', label: '⏱️ Newest' }, 
                    { value: 'oldest', label: '📅 Oldest' }, 
                    { value: 'name-asc', label: '🔤 A-Z' }, 
                    { value: 'name-desc', label: '🔤 Z-A' }
                  ]}
                  className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all font-semibold"
                />

                <div className="flex gap-2 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-1.5 border-2 border-gray-200 dark:border-gray-600 shadow-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      viewMode === 'grid'
                        ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md scale-105'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700'
                    }`}
                  >
                    ⊞ Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      viewMode === 'list'
                        ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white shadow-md scale-105'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700'
                    }`}
                  >
                    ☰ List
                  </button>
                </div>
              </div>

              {/* Results Counter */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <p className="text-lg font-black text-gray-900 dark:text-white">
                  Found <span className="bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">{filtered.length}</span> pet{filtered.length !== 1 ? 's' : ''}
                  {query && <span className="text-gray-600 dark:text-gray-400 ml-2">for "{query}"</span>}
                </p>
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold underline"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>

            {/* Pet Grid/List */}
            {filtered.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {filtered.map(pet => (
                  <PetCard 
                    key={pet.id} 
                    pet={pet} 
                    isFavourited={favourites.includes(pet.id)} 
                    onFavourite={() => { if (isAuthenticated) toggleFavourite(pet.id) }} 
                    onMeetClick={() => { /* navigate to detail handled internally */ }} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-gradient-to-br from-orange-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-3xl border-2 border-dashed border-orange-200 dark:border-orange-700">
                <div className="mb-4 animate-bounce">
                  <p className="text-6xl">🔍</p>
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">No Pets Match Your Search</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">We couldn't find any pets with those filters.</p>
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 font-semibold">Try:</p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>✓ Searching with different keywords</li>
                    <li>✓ Adjusting age or color filters</li>
                    <li>✓ Checking different locations</li>
                    <li>✓ Removing some filters</li>
                  </ul>
                </div>
                <Button 
                  variant="primary" 
                  onClick={() => { 
                    setFilters({}); 
                    setQuery('');
                    setGender('');
                    setColor('');
                    setAgeRange('');
                  }}
                  className="mt-8 px-8 py-3 text-lg font-bold"
                >
                  Reset All Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdoptPage
