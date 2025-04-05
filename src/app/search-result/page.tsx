'use client'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import SearchBar from '../components/SearchBar'
import SearchResultSkeleton from '../components/SearchResultSkeleton'
import { useRouter } from 'next/navigation'
import { SearchResultItem } from '@/types'
import { Facebook, Instagram, Youtube } from 'lucide-react'
import { FaXTwitter } from "react-icons/fa6";
import { displayTipo } from '@/utils/tipos'
import { Switch } from '@/components/ui/switch'
import { sendGAEvent } from '@next/third-parties/google'
import { useSearchHandlers } from '@/hooks/useSearchHandlers';
import { toast } from 'sonner';
import { useReCaptcha } from '@/hooks/useReCaptcha'
import { useSearchContext } from '@/context/SearchContext';

function SearchResultContent() {
  const searchParams = useSearchParams()
  const query = searchParams?.get('q') || ''
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showNoticias, setShowNoticias] = useState(false)
  const { handleSubmitSearch, handleItemClick, handleSearchApi } = useSearchHandlers();
  const { isReady } = useReCaptcha();
  const { cachedResults, query: contextQuery } = useSearchContext();

  useEffect(() => {
    const fetchResults = async () => {
      if (query && isReady) {
        setLoading(true);

        // Use cached results if available and query matches
        if (query === contextQuery && cachedResults.length > 0) {
          setResults(cachedResults);
          setLoading(false);
          return;
        }

        // Otherwise fetch new results
        try {
          const data = await handleSearchApi(query);
          setResults(data);
        } catch (error) {
          console.error('Error fetching search results:', error);
          setResults([]);
          toast.error('Oops! Parece que algo saiu do esperado. Tente novamente em alguns instantes.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResults();
  }, [query, handleSearchApi, isReady, cachedResults, contextQuery]);

  const filteredResults = showNoticias ? results : results.filter(item => item.tipo !== 'noticia')

  const handleCheckedChange = (checked: boolean) => {
    setShowNoticias(checked);
    sendGAEvent('event', 'toggle de notícias selecionado', { value: checked ? 'Notícias on' : 'Notícias off' });
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      {/* Search Bar and Switch */}
      <div className="flex flex-col mb-6">
        <SearchBar defaultValue={query} onSearch={handleSubmitSearch} className="mb-3" />
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

      {/* Results */}
      {loading ? (
        <SearchResultSkeleton />
      ) : (
        <>
      <div className="text-sm text-gray-500 mb-4">
        {filteredResults.length} Resultados
      </div>
          {filteredResults.length > 0 ? (
            <div className="space-y-4">
              {filteredResults.map((item, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg shadow-sm p-6 hover:bg-gray-50 ${(item.url) ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={() => handleItemClick(item, index, query, showNoticias)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3
                        className="text-gray-900 font-medium mb-2"
                        dangerouslySetInnerHTML={{ __html: item.titulo }}
                      ></h3>
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
                      {item.descricao && <hr className="border-gray-200 my-4" />}
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
              height={32}
              className="brightness-0 invert cursor-pointer"
            />
            <div className="flex flex-row gap-6">
              <button
                className="text-white hover:text-gray-600 cursor-pointer"
                onClick={() => window.open('https://www.instagram.com/prefeitura_rio/', '_blank')}
              >
                <Instagram size={18} />
              </button>
              <button
                className="text-white hover:text-gray-600 cursor-pointer"
                onClick={() => window.open('https://x.com/Prefeitura_Rio', '_blank')}
              >
                <FaXTwitter size={18} />
              </button>
              <button
                className="text-white hover:text-gray-600 cursor-pointer"
                onClick={() => window.open('https://www.facebook.com/PrefeituradoRio/', '_blank')}
              >
                <Facebook size={18} />
              </button>
              <button
                className="text-white hover:text-gray-600 cursor-pointer"
                onClick={() => window.open('https://www.youtube.com/prefeiturario', '_blank')}
              >
                <Youtube size={18} />
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
  );
}