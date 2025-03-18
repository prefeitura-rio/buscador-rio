'use client'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import SearchBar from '../components/SearchBar'
import SearchResultSkeleton from '../components/SearchResultSkeleton'
import { useRouter } from 'next/navigation'
import { SearchResultItem } from '@/types'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'


function SearchResultContent() {
  const searchParams = useSearchParams()
  const query = searchParams?.get('q') || ''
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        setLoading(true)
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
          const data = await response.json()
          setResults(data.result || [])
        } catch (error) {
          console.error('Error fetching search results:', error)
          setResults([])
        } finally {
          setLoading(false)
        }
      }
    }

    fetchResults()
  }, [query])

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      {/* Search Bar */}
      <SearchBar defaultValue={query} className="mb-6" />

      {/* Results Count */}
      <div className="text-sm text-gray-500 mb-4">
        {results.length} Resultados
      </div>

      {/* Results */}
      {loading ? (
        <SearchResultSkeleton />
      ) : (
        <>
          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((item, index) => (
                <div 
                  key={index}
                  className={`bg-white rounded-lg shadow-sm p-6 hover:bg-gray-50 ${item.link_acesso ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={() => item.link_acesso && window.open(item.link_acesso, '_blank')}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-medium mb-2">{item.titulo}</h3>
                      <div className="flex items-center gap-2 text-xs text-[#008FBE] mb-2">
                        {item.servico === true ? (
                        <span className="font-bold">Serviço</span>
                        ) : (
                          <span className="font-bold">Informação</span>
                        )}
                        {/* <span className="text-gray-500">{'>'}</span>
                        <span className="text-gray-500">lorem</span>
                        <span className="text-gray-500">{'>'}</span>
                        <span className="text-gray-500">ipsum</span> */}
                      </div>
                      <hr className="border-gray-200 my-4" />
                      <p className="text-gray-600 text-sm">{item.descricao}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600">Nenhum resultado encontrado para &ldquo;{query}&rdquo;</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function SearchResult() {
  const router = useRouter()
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#008FBE] py-4">
        <div className="flex justify-center">
          <div className="mx-4 md:mx-0 w-full max-w-[760px] flex justify-between">
          <Image
            onClick={() => router.push('/')} 
            src="/logo_prefeitura.svg" 
            alt="Prefeitura do Rio" 
            width={80} 
            height={100} 
            className="brightness-0 invert cursor-pointer"
          />
          <div className="flex flex-row gap-6">
              <button
                className="text-white hover:text-gray-600 cursor-pointer"
                onClick={() => window.open('https://www.instagram.com/prefeitura_rio/', '_blank')}
              >
                <Instagram size={20} />
              </button>
              <button
                className="text-white hover:text-gray-600 cursor-pointer"
                onClick={() => window.open('https://x.com/Prefeitura_Rio', '_blank')}
              >
                <Twitter size={20} />
              </button>
              <button
                className="text-white hover:text-gray-600 cursor-pointer"
                onClick={() => window.open('https://www.facebook.com/PrefeituradoRio/', '_blank')}
              >
                <Facebook size={20} />
              </button>
              <button
                className="text-white hover:text-gray-600 cursor-pointer"
                onClick={() => window.open('https://www.youtube.com/prefeiturario', '_blank')}
              >
                <Youtube size={20} />
              </button>
            </div>
        </div>
        </div>
      </div>

      {/* Main Content */}
      <Suspense fallback={<SearchResultSkeleton />}>
        <SearchResultContent />
      </Suspense>
    </div>
  )
}
