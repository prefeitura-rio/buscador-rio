'use client'
import { useState } from 'react';
import { XIcon, ArrowRightIcon, ExternalLinkIcon } from 'lucide-react';

type SearchResultItem = {
  titulo: string;
  descricao: string;
  link_acesso?: string;
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);

    if (e.target.value.length > 2) {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${e.target.value}`);
        const data = await response.json();
        setResults(data.result || []);
        console.log('Search results:', data.result);
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

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  const handleAdvancedSearch = () => {
    window.open(`https://prefeitura.rio/buscaavancada?q=${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <div className="relative">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full bg-cover bg-center z-50" style={{ backgroundImage: "url('./header.png')", height: '220px' }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white mx-2">
          <h1 className="text-xl mx-10 md:text-3xl font-bold mb-4 text-center">A Prefeitura do Rio mais perto de você</h1>
          <div className="relative w-full max-w-md">
            {/* SearchBox */}
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              className="w-full p-3 border text-black border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#12bbef] pr-10"
              placeholder="O que você procura?"
            />
            {/* X Icon to Clear Search */}
            {query.length > 0 && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                <XIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition" style={{ width: '20px', height: '20px' }} />
              </button>
            )}

            {/* Results Box */}
            {(query.length > 2 || loading) && (
              <div className="absolute w-full mt-2 bg-white text-black rounded-md shadow-lg">
                <ul className="divide-y divide-gray-200 max-h-72 overflow-y-auto">
                  {loading ? (
                    <div className="flex justify-center items-center py-2">
                      <div className="loader ease-linear rounded-full border-t-4 border-gray-200 h-6 w-6"></div>
                    </div>
                  ) : (
                    results.map((item, index) => (
                      <li
                        key={index}
                        className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                        onClick={() => {
                          if (item.link_acesso) {
                            window.open(item.link_acesso, '_blank');
                          }
                        }}
                      >
                        <div className="mr-4">
                          <strong>{item.titulo}</strong>
                          <p className='text-sm text-gray-500'>
                            {item.descricao.length > 50 ? `${item.descricao.substring(0, 50)}...` : item.descricao}
                          </p>
                        </div>
                        <div style={{ width: '20px', height: '20px' }}>
                          <ExternalLinkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition" />
                        </div>
                      </li>
                    ))
                  )}
                </ul>

                {/* Fixed Bottom Button */}
                <button
                  onClick={handleAdvancedSearch}
                  className="w-full cursor-pointer bg-[#12bbef] text-white p-3 text-center rounded-b-md font-medium hover:bg-black hover:text-white transition-all duration-300 flex justify-between items-center"
                >
                  <span>Busca Avançada</span>
                  <ArrowRightIcon className="h-5 w-5" style={{ width: '20px', height: '20px' }} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
