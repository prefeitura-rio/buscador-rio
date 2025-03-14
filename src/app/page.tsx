'use client'
import { useState } from 'react';
import { ArrowRightIcon, TrendingUp } from 'lucide-react';
// import { ArrowRightIcon, Plus, Image as ImageIcon, Mic } from 'lucide-react';
import Image from 'next/image';
import "./globals.css"
import { useRouter } from 'next/navigation';

export default function Home() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter()

  const popularSearches = [
    { icon: 'trend', text: 'neymar jr' },
    { icon: 'trend', text: 'amado batista'},
    { icon: 'trend', text: 'caso vitória' },
  ];

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen relative bg-[#F8F8F8] bg-[url('/background-pattern.svg')] bg-center bg-[length:100%_auto]"
    >

      {/* Logo da Prefeitura */}
      <div className="absolute top-10 flex items-center gap-2">
        <Image src="/logo_prefeitura.svg" alt="Prefeitura do Rio" width={80} height={100} className="mb-6" />
      </div>

      <div className={`flex flex-col items-center w-full transition-all duration-500 ease-in-out transform ${isFocused ? '-translate-y-20' : 'translate-y-0'}`}>
        {/* Título */}
        <h1 className="pb-1 text-4xl sm:text-5xl font-semibold text-center bg-gradient-to-r from-[#27B8DB] to-[#3F38AC] bg-clip-text text-transparent">
          Fale com a gente! <br /> Como podemos ajudar?
        </h1>

        {/* Campo de pesquisa e sugestões */}
        <div className="relative mt-6 w-full max-w-md sm:max-w-3xl">
          <div className={`absolute w-full bg-white rounded-3xl shadow-lg transition-all duration-300 overflow-hidden ${isFocused ? 'max-h-[600px]' : 'max-h-[60px]'}`}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full p-4 pl-6 pr-14 bg-white focus:outline-none text-gray-700 text-lg border-b border-gray-100"
              placeholder="O que você está precisando?"
            />
            <button className="absolute right-4 top-[18px] text-gray-600">
              <ArrowRightIcon size={24} />
            </button>

            {/* Sugestões */}
            <div className="p-4">
              <h2 className="text-sm font-semibold text-gray-500 mb-4">MAIS POPULARES AGORA</h2>
              <div className="space-y-3">
                {popularSearches.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer">
                   <TrendingUp size={16} className="text-gray-400" />
                    <div>
                      <div className="text-gray-700">{item.text}</div>
                    </div>
                  </div>
                ))}
              </div>
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
        <button 
          onClick={() => router.push('/learn-more')} 
          className="hover:cursor-pointer mt-10 px-5 py-2 text-white rounded-full text-md bg-linear-to-r/srgb from-[#27B8DB] to-[#3F38AC]"
        >
          Preciso de ajuda
        </button>
      </div>

      {/* Logo IplanRio */}
      <div className="absolute bottom-10 flex items-center gap-2">
        <Image src="/logo_iplan.svg" alt="Iplan logo" width={110} height={110} className="mb-6" />
      </div>
    </div>
  );
}
