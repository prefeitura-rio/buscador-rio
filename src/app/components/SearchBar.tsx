'use client'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface SearchBarProps {
  defaultValue?: string
  onSearch?: (query: string) => void
  className?: string
}

export default function SearchBar({ defaultValue = '', onSearch, className = '' }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()

  const clearSearch = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setQuery('')
  }

  const handleSubmitSearch = () => {
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim())
      } else {
        router.push(`/search-result?q=${encodeURIComponent(query.trim())}`)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitSearch()
    }
  }

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        className="w-full p-4 pl-6 pr-24 rounded-full bg-white focus:outline-none text-gray-700 shadow-sm"
        placeholder="O que você está precisando?"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {query && (
          <>
            <button
              onClick={clearSearch}
              onMouseDown={(e) => e.preventDefault()}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={20} />
            </button>
            <div className="h-6 w-[1px] bg-gray-200"></div>
          </>
        )}
        {query && (
        <button
          onClick={handleSubmitSearch}
          className="text-gray-400 hover:text-gray-600 cursor-pointer"
        >
            <Search size={20} />
          </button>
        )}
      </div>
    </div>
  )
} 