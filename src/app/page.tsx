'use client'
import { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon, TrendingUp, ExternalLinkIcon, X } from 'lucide-react';
import Image from 'next/image';
import "./globals.css"
import { useRouter } from 'next/navigation';
import { SearchResultItem } from '@/types';
import { popularSearches } from '@/utils/popularSearchs';
import SearchResultSkeleton from '@/app/components/SearchResultSkeletonHome';
import Link from 'next/link';
import { displayBreadCrumbCollection, displayTipo } from '@/utils/tipos';
import { setCookie, parseCookies } from 'nookies';
import { v4 as uuidv4 } from 'uuid';
import { useSearchHandlers } from '@/hooks/useSearchHandlers';
import { sendGAEvent } from '@next/third-parties/google'
import { toast } from 'sonner';

export default function Home() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter()
  const { handleSubmitSearch, handleItemClick, handleSearchApi } = useSearchHandlers();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const cookies = parseCookies();
    if (!cookies.session_id) {
      const newSessionId = generateSessionId();
      setCookie(null, 'session_id', newSessionId, {
        maxAge: 30 * 24 * 60 * 60, // 30 dias
        path: '/',
      });
    }
  }, []);

  const generateSessionId = () => {
    return uuidv4();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (newQuery.length > 2) {
      setIsSearching(true);
      debounceTimeout.current = setTimeout(async () => {
        setLoading(true);
        try {
          const results = await handleSearchApi(newQuery, false);
          setResults(results);
        } catch (error) {
          console.error("Error fetching search results:", error);
          setResults([]);
          toast.error(`Oops! Parece que algo saiu do esperado. Tente novamente em alguns instantes.`);
        } finally {
          setLoading(false);
          setIsSearching(false);
        }
      }, 500); // 500ms delay
    } else {
      setResults([]);
      setIsSearching(false);
    }
  };

  const clearSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuery('');
    setResults([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitSearch(query, false);
      sendGAEvent('event', 'apertou enter para pesquisar na home');
    }
  };

  // Filter results to exclude items with tipo 'noticia'
  const filteredResults = results.filter(item => item.tipo !== 'noticia');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="absolute inset-0 flex flex-col">
        {/* Logo da Prefeitura */}
        <div className="relative flex items-center gap-2 mt-10 justify-center">
          <Link href="https://prefeitura.rio" target="_blank" rel="noopener noreferrer">
            <Image src="/logo_prefeitura.svg" alt="Prefeitura do Rio" width={80} height={32} className="mb-6" />
          </Link>
        </div>

        {/* Logo IplanRio */}
        <div className="relative mt-auto flex items-center gap-2 justify-center mb-10">
          <span className="text-gray-500 text-xs flex items-center">
            Desenvolvido e mantido com ‪‪❤︎‬ por{' '}
            <Link
              href="https://www.iplan.rio/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline flex items-center"
              onClick={() => sendGAEvent('event', 'click no hiperlink da iplan na home')}
            >
              <Image src="/iplan-animated-logo.gif" alt="IplanRio" width={70} height={15} className="ml-0" />
            </Link>
          </span>
        </div>
      </div>

      <div className={`mb-30 px-4 flex flex-col items-center w-full transition-all duration-500 ease-in-out transform ${isFocused ? '-translate-y-20' : 'translate-y-0'} relative`} style={{ zIndex: 50 }}>
        {/* Título */}
        <h1 className="pb-1 text-4xl sm:text-5xl font-semibold text-center bg-gradient-to-r from-[#27B8DB] to-[#3F38AC] bg-clip-text text-transparent">
          Fale com a gente! <br /> Como podemos ajudar?
        </h1>

        {/* Campo de pesquisa e sugestões */}
        <div className="relative mt-6 w-full max-w-md sm:max-w-3xl">
          <div className={`absolute w-full bg-white rounded-3xl shadow-lg transition-all duration-300 overflow-hidden ${isFocused ? 'max-h-[450px]' : 'max-h-[60px]'}`}>
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyPress}
              className="w-full p-4 pl-6 pr-24 bg-white focus:outline-none text-gray-700 text-lg border-b border-gray-100"
              placeholder="Do que você precisa?"
            />
            <div className="absolute right-4 top-[18px] flex items-center gap-2">
              {query && (
                <>
                  <button
                    onClick={clearSearch}
                    onMouseDown={(e) => e.preventDefault()}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X size={24} />
                  </button>
                  <div className="h-6 w-[1px] bg-gray-200"></div>
                </>
              )}
              {query && (
                <button
                  onClick={() => {
                    handleSubmitSearch(query, false);
                    sendGAEvent('event', 'clicou no botão de pesquisar no searchbar da home');
                  }}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <ArrowRightIcon size={24} />
                </button>
              )}
            </div>

            {/* Resultados da Pesquisa ou Sugestões Populares  */}
            <div className="p-4 max-h-[350px] overflow-y-auto mr-2">
              {loading || isSearching ? (
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 mb-4 pl-2">RESULTADOS DA PESQUISA</h2>
                  <SearchResultSkeleton />
                </div>
              ) : query.length > 2 ? (
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 mb-4 pl-2">RESULTADOS DA PESQUISA</h2>
                  {filteredResults.length > 0 ? (
                    <div className="space-y-3">
                      {filteredResults.map((item, index) => {
                        const link = item.url;
                        return (
                          <div key={index}>
                            <div
                              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer"
                              onClick={() => {
                                handleItemClick(item, index, query, ['servicos'], false);
                              }}
                            >
                              <div className="flex-1">
                                <h3
                                  className="text-gray-900 font-medium mb-2"
                                  dangerouslySetInnerHTML={{ __html: item.titulo }}
                                ></h3>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-[#008FBE] mb-2">
                                  <span className="font-bold">{displayTipo(item.tipo)}</span>
                                  <span className="text-gray-500">{'>'}</span>
                                  <span className="text-gray-500">{item.category?.macro}</span>
                                  <span className="text-gray-500">{'>'}</span>
                                  <span className="text-gray-500">{item.category?.micro}</span>
                                  <span className="text-gray-500">{'>'}</span>
                                  <span className="text-gray-500">{item.category?.specific}</span>
                                  <span className="bg-gray-200 rounded-xl text-xs text-gray-500 px-2 py-0.5">{displayBreadCrumbCollection(item.collection)}</span>
                                </div>
                              </div>
                              {link && (
                                <ExternalLinkIcon size={16} className="text-gray-400" />
                              )}
                            </div>
                            {index < filteredResults.length - 1 && <hr className="border-gray-200 my-2" />}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center mt-4">Nenhum resultado encontrado</div>
                  )}
                </div>
              ) : (
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 mb-4 pl-2">MAIS POPULARES AGORA</h2>
                  <div className="space-y-3">
                    {popularSearches.map((item, index) => (
                      <div key={index}>
                        <div
                          className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer"
                          onClick={() => {
                            setQuery(item.text);
                            router.push(`/search-result?q=${encodeURIComponent(item.text)}`);
                          }}
                        >
                          <div className="flex-shrink-0">
                            <TrendingUp size={16} className="text-gray-400" />
                          </div>
                          <div className="text-gray-700 text-base">{item.text}</div>
                        </div>
                        {index < popularSearches.length - 1 && <hr className="border-gray-200 my-2" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}