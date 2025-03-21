'use client'
import { useState } from 'react';
import { ArrowRightIcon, TrendingUp, ExternalLinkIcon, X } from 'lucide-react';
// import { ArrowRightIcon, Plus, Image as ImageIcon, Mic } from 'lucide-react';
import Image from 'next/image';
import "./globals.css"
import { useRouter } from 'next/navigation';
import { SearchResultItem } from '@/types';
import { popularSearches } from '@/utils/popularSearchs';
import SearchResultSkeleton from '@/app/components/SearchResultSkeletonHome';
import Link from 'next/link';


export default function Home() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (newQuery.length > 2) {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${newQuery}`);
        const data = await response.json();
        setResults(data.result || []);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
    }
  };

  const clearSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuery('');
    setResults([]);
  };

  const handleSubmitSearch = () => {
    if (query.trim()) {
      router.push(`/search-result?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitSearch();
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen"
    >
      <div className="absolute inset-0 flex flex-col">
        {/* Logo da Prefeitura */}
        <div className="relative flex items-center gap-2 mt-10 justify-center">
          <Image src="/logo_prefeitura.svg" alt="Prefeitura do Rio" width={80} height={100} className="mb-6" />
        </div>

        {/* Logo IplanRio */}
        <div className="relative mt-auto flex items-center gap-2 justify-center mb-10">
          <span className="text-gray-500 text-xs">
            Desenvolvido e mantido com ‪‪❤︎‬ por{' '}
            <Link
              href="https://iplanrio.prefeitura.rio/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              IplanRio
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
                  onClick={handleSubmitSearch}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <ArrowRightIcon size={24} />
                </button>
              )}
            </div>

            {/* Resultados da Pesquisa ou Sugestões Populares */}
            <div className="p-4 max-h-[350px] overflow-y-auto mr-2">
              {loading ? (
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 mb-4 pl-2">RESULTADOS DA PESQUISA</h2>
                  <SearchResultSkeleton />
                </div>
              ) : query.length > 2 ? (
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 mb-4 pl-2">RESULTADOS DA PESQUISA</h2>
                  <div className="space-y-3">
                    {results.map((item, index) => (
                      <div key={index}>
                        <div 
                          className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer"
                          onClick={() => item.link_carioca_digital && window.open(item.link_carioca_digital, '_blank')}
                        >
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
                          </div>
                          {item.link_carioca_digital && (
                            <ExternalLinkIcon size={16} className="text-gray-400" />
                          )}
                        </div>
                        {index < results.length - 1 && <hr className="border-gray-200 my-2" />}
                      </div>
                    ))}
                  </div>
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

        {/* Botões de adicionar arquivos, imagem e áudio */}
        {/* <div className="flex gap-4 mt-4">
          <button className="flex flex-row items-center gap-2 px-4 py-2 rounded-full text-gray-400 bg-white hover:bg-gray-100">
            <Plus size={20} /> Adicionar arquivos
          </button>
          <button className="flex flex-row items-center gap-2 px-4 py-2 rounded-full text-gray-400 bg-white hover:bg-gray-100">
            <ImageIcon size={20} /> Adicionar Imagem
          </button>
          <button className="flex flex-row items-center gap-2 px-4 py-2 rounded-full text-gray-400 bg-white hover:bg-gray-100">
            <Mic size={20} /> Enviar áudio
          </button>
        </div> */}

        {/* Botão principal */}
        {/* <button 
          onClick={() => router.push('/learn-more')} 
          className="hover:cursor-pointer mt-30 px-5 py-2 text-white rounded-full text-md bg-linear-to-r/srgb from-[#27B8DB] to-[#3F38AC]"
        >
          Preciso de ajuda
        </button> */}
      </div>
    </div>
  );
}
