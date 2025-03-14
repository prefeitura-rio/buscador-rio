'use client'
import { useState } from 'react';
import { ArrowRightIcon, Plus, Image as ImageIcon, Mic } from 'lucide-react';
import Image from 'next/image';
import "./globals.css"

export default function Home() {
  const [query, setQuery] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F8F8] relative">

      {/* Logo da Prefeitura */}
      <div className="absolute top-10 flex items-center gap-2">
        <Image src="/logo_prefeitura.svg" alt="Prefeitura do Rio" width={80} height={100} className="mb-6" />
      </div>

      {/* Título */}
      <h1 className="text-4xl sm:text-5xl font-semibold text-center bg-gradient-to-r from-[#27B8DB] to-[#3F38AC] bg-clip-text text-transparent">
        Fale com a gente! <br /> Como podemos ajudar?
      </h1>

      {/* Campo de pesquisa */}
      <div className="relative mt-6 w-full max-w-md sm:max-w-3xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-4 pl-6 pr-14  bg-white rounded-full focus:outline-none  text-gray-700 text-lg"
          placeholder="O que você está precisando?"
        />
        <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600">
          <ArrowRightIcon size={24} />
        </button>
      </div>

      {/* Botões de adicionar arquivos, imagem e áudio */}
      <div className="flex gap-4 mt-4">
        <button className="flex flex-row items-center gap-2 px-4 py-2 rounded-full text-gray-400 bg-white hover:bg-gray-100">
          <Plus size={20} /> Adicionar arquivos
        </button>
        <button className="flex flex-row items-center gap-2 px-4 py-2 rounded-full text-gray-400 bg-white hover:bg-gray-100">
          <ImageIcon size={20} /> Adicionar Imagem
        </button>
        <button className="flex flex-row items-center gap-2 px-4 py-2 rounded-full text-gray-400 bg-white hover:bg-gray-100">
          <Mic size={20} /> Enviar áudio
        </button>
      </div>

      {/* Botão principal */}
      <button className="mt-10 px-5 py-2 text-white rounded-full text-md bg-linear-to-r/srgb from-[#27B8DB] to-[#3F38AC]">
        Preciso de ajuda
      </button>

      {/* Logo IplanRio */}
      <div className="absolute bottom-10 flex items-center gap-2">
        <Image src="/logo_iplan.svg" alt="Iplan logo" width={110} height={110} className="mb-6" />
      </div>
    </div>
  );
}
