'use client'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import SearchBar from '../components/SearchBar'
import SearchResultSkeleton from '../components/SearchResultSkeleton'
import { useRouter } from 'next/navigation'
import { SearchResultItem } from '@/types'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import { displayTipo } from '@/utils/tipos'
import { Switch } from '@/components/ui/switch'
import { sendGAEvent } from '@next/third-parties/google'
import { parseCookies } from 'nookies'


function SearchResultContent() {
  const searchParams = useSearchParams()
  const query = searchParams?.get('q') || ''
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showNoticias, setShowNoticias] = useState(false)


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

  const filteredResults = showNoticias ? results : results.filter(item => item.tipo !== 'noticia')

  const handleCheckedChange = (checked: boolean) => {
    setShowNoticias(checked);
    sendGAEvent('event', 'toggle de notícias selecionado', { value: checked ? 'Notícias on' : 'Notícias off' });
  };

  const handleItemClick = async (item: SearchResultItem, index: number) => {
    const cookies = parseCookies();
    const session_id = cookies.session_id;
    const link = item.link_carioca_digital || item.link_acesso;
    const portal_origem = ""
    const tipo_dispositivo = ""

    await fetch('/api/metrics/clique', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id,
        query,
        posicao: index,
        objeto_clicado: item,
        portal_origem, 
        tipo_dispositivo
      }),
    });

    if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      {/* Search Bar and Switch */}
      <div className="flex flex-col mb-6">
        <SearchBar defaultValue={query} className="mb-3" />
        <div className="flex justify-end items-center gap-2">
          <Switch 
            className="hover:cursor-pointer"
            checked={showNoticias}
            onCheckedChange={handleCheckedChange}
          />
          <span className="text-sm text-gray-500">Mostrar notícias relacionadas</span>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500 mb-4">
        {filteredResults.length} Resultados
      </div>

      {/* Results */}
      {loading ? (
        <SearchResultSkeleton />
      ) : (
        <>
          {filteredResults.length > 0 ? (
            <div className="space-y-4">
              {filteredResults.map((item, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg shadow-sm p-6 hover:bg-gray-50 ${(item.link_carioca_digital || item.link_acesso) ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={() => handleItemClick(item, index)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-medium mb-2">{item.titulo}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#008FBE] mb-2">
                        <span className="font-bold">{displayTipo(item.tipo)}</span>
                        <span className="text-gray-500 whitespace-nowrap">{'>'}</span>
                        <span className="text-gray-500 whitespace-nowrap">{item.category?.macro}</span>
                        <span className="text-gray-500 whitespace-nowrap">{'>'}</span>
                        <span className="text-gray-500 whitespace-nowrap">{item.category?.micro}</span>
                        <span className="text-gray-500 whitespace-nowrap">{'>'}</span>
                        <span className="text-gray-nowrap text-gray-500">{item.category?.specific}</span>
                        <span className="bg-gray-200 rounded-xl text-xs text-gray-500 px-2 py-0.5 whitespace-nowrap">
                          {item.id_1746 ? "1746" : item.id_carioca_digital ? "carioca digital" : "prefeitura rio"}
                        </span>
                      </div>
                    { item.descricao && <hr className="border-gray-200 my-4" />}
                      <p className="text-gray-600 text-sm line-clamp-3">{item.descricao}</p>
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
