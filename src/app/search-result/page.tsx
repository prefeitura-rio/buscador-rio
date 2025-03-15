'use client'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ExternalLinkIcon } from 'lucide-react'
import SearchBar from '../components/SearchBar'

type SearchResultItem = {
  titulo: string;
  descricao: string;
  link_acesso?: string;
  categoria?: string;
  orgao?: string;
  ano?: string;
  portal?: string;
};

export default function SearchResult() {
  const searchParams = useSearchParams()
  const query = searchParams?.get('q') || ''
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [loading, setLoading] = useState(true)
  // const [selectedFilters, setSelectedFilters] = useState({
  //   categoria: '',
  //   orgao: '',
  //   ano: '',
  //   portal: ''
  // })

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
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#008FBE] py-4">
        <div className="flex justify-center">
          <Image 
            src="/logo_prefeitura.svg" 
            alt="Prefeitura do Rio" 
            width={80} 
            height={100} 
            className="brightness-0 invert"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[800px] mx-auto px-4 py-8">
        {/* Search Bar */}
        <SearchBar defaultValue={query} className="mb-6" />

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          {/* <select 
            value={selectedFilters.categoria}
            onChange={(e) => setSelectedFilters(prev => ({ ...prev, categoria: e.target.value }))}
            className="px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 text-sm"
          >
            <option value="">Categoria</option>
            <option value="servicos">Serviços</option>
            <option value="imoveis">Imóveis</option>
          </select> */}

          {/* <select 
            value={selectedFilters.orgao}
            onChange={(e) => setSelectedFilters(prev => ({ ...prev, orgao: e.target.value }))}
            className="px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 text-sm"
          >
            <option value="">Órgão</option>
          </select>

          <select 
            value={selectedFilters.ano}
            onChange={(e) => setSelectedFilters(prev => ({ ...prev, ano: e.target.value }))}
            className="px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 text-sm"
          >
            <option value="">Ano</option>
          </select> */}

          {/* <select 
            value={selectedFilters.portal}
            onChange={(e) => setSelectedFilters(prev => ({ ...prev, portal: e.target.value }))}
            className="px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 text-sm"
          >
            <option value="">Portal</option>
          </select> */}
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-500 mb-4">
          {results.length} Resultados
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="loader ease-linear rounded-full border-t-4 border-gray-200 h-8 w-8"></div>
          </div>
        ) : (
          <>
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((item, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-lg shadow-sm p-6 hover:bg-gray-50 cursor-pointer"
                    onClick={() => item.link_acesso && window.open(item.link_acesso, '_blank')}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-gray-900 font-medium mb-2">{item.titulo}</h3>
                        <div className="flex items-center gap-2 text-xs text-[#008FBE] mb-2">
                          <span>Serviços</span>
                          <span>•</span>
                          <span>Imóveis</span>
                          <span>•</span>
                          <span>IPTU</span>
                        </div>
                        <hr className="border-gray-200 my-4" />
                        <p className="text-gray-600 text-sm">{item.descricao}</p>
                        {item.link_acesso && (
                          <div className="flex items-center gap-2 mt-2 text-blue-600">
                            <span className="text-sm">Acessar</span>
                            <ExternalLinkIcon size={16} />
                          </div>
                        )}
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
    </div>
  )
}
