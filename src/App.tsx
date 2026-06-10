import { useState, useEffect } from 'react';
import { Search, Loader2, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Pokemon, PokemonListResponse } from './types';

function App() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  
  // Pagination
  const [offset, setOffset] = useState(0);
  const limit = 20;

  // Detail view
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchPokemonList();
  }, [offset]);

  const fetchPokemonList = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
      const data: PokemonListResponse = await response.json();
      
      const detailedPokemon = await Promise.all(
        data.results.map(async (p) => {
          const res = await fetch(p.url);
          return res.json();
        })
      );
      
      setPokemon(detailedPokemon);
    } catch (err) {
      setError('Failed to fetch Pokemon');
    } finally {
      setLoading(false);
    }
  };

  const filteredPokemon = pokemon.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedPokemon) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} py-8 px-4`}>
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setSelectedPokemon(null)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all mb-6 ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <ArrowLeft className="w-5 h-5" />
            ⬅ Kembali ke Daftar
          </button>

          {loadingDetail ? (
            <div className={`flex flex-col items-center justify-center py-20 rounded-2xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Memuat detail Pokémon...</p>
            </div>
          ) : (
            <div className={`rounded-2xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`p-8 flex justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <img
                  src={selectedPokemon.sprites.other?.['official-artwork'].front_default || selectedPokemon.sprites.front_default}
                  alt={selectedPokemon.name}
                  className="w-64 h-64 object-contain"
                />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-4xl font-bold capitalize ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedPokemon.name}
                  </h2>
                  <span className="text-2xl font-mono text-gray-400">
                    #{String(selectedPokemon.id).padStart(3, '0')}
                  </span>
                </div>

                <div className="flex gap-3 mb-8">
                  {selectedPokemon.types.map((t) => (
                    <span
                      key={t.type.name}
                      className="px-4 py-1.5 rounded-full text-sm font-bold capitalize bg-blue-100 text-blue-800"
                    >
                      {t.type.name}
                    </span>
                  ))}
                </div>

                <div className="mb-8">
                  <p className={`text-lg ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}><strong>Type:</strong> {selectedPokemon.types.map((t) => t.type.name).join(', ')}</p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className="text-gray-500 text-sm mb-1">Height</p>
                    <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedPokemon.height / 10} m</p>
                  </div>
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className="text-gray-500 text-sm mb-1">Weight</p>
                    <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedPokemon.weight / 10} kg</p>
                  </div>
                </div>

                <div>
                  <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Stats</h3>
                  <div className="space-y-4">
                    {selectedPokemon.stats.map((s) => (
                      <div key={s.stat.name}>
                        <div className="flex justify-between mb-1">
                          <span className={`text-sm font-medium capitalize ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{s.stat.name}</span>
                          <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{s.base_stat}</span>
                        </div>
                        <div className={`w-full rounded-full h-2.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <div
                            className="bg-blue-500 h-2.5 rounded-full"
                            style={{ width: `${Math.min(100, (s.base_stat / 255) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} py-8 px-4`}>
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center relative">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`absolute right-0 top-0 p-3 rounded-full shadow-lg transition-all ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-indigo-600 text-white'}`}
            title="Toggle Dark Mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <h1 className={`text-5xl font-black mb-6 tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Daftar Pokémon
          </h1>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Cari Pokémon di halaman ini..."
              className={`w-full pl-12 pr-4 py-3 rounded-2xl border-none shadow-lg focus:ring-4 focus:ring-blue-500/20 text-lg ${darkMode ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-white text-gray-900'}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
            <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Memuat daftar Pokémon...</p>
          </div>
        ) : error ? (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-12 rounded-3xl shadow-xl text-center max-w-md mx-auto`}>
            <p className="text-red-500 text-lg font-bold mb-4">{error}</p>
            <button
              onClick={fetchPokemonList}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredPokemon.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPokemon(p)}
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'} pokemon-card rounded-3xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group`}
                >
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-6 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors`}>
                    <img
                      src={p.sprites.other?.['official-artwork'].front_default || p.sprites.front_default}
                      alt={p.name}
                      className="w-44 h-44 object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-sm font-bold text-gray-400 mb-1 block">
                      #{String(p.id).padStart(3, '0')}
                    </span>
                    <h2 className={`text-2xl font-bold capitalize mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {p.name}
                    </h2>
                    <div className="flex gap-2">
                      {p.types.map((t) => (
                        <span
                          key={t.type.name}
                          className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors`}
                        >
                          {t.type.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 flex justify-center items-center gap-6">
              <button
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - limit))}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <ChevronLeft className="w-5 h-5" /> ⬅ Previous
              </button>
              <span className={`font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} data-testid="page-number">
                Halaman ke-{Math.floor(offset / limit) + 1}
              </span>
              <button
                onClick={() => setOffset(offset + limit)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl shadow-md transition-colors font-bold ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Next ➡ <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}

        {!loading && filteredPokemon.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-2xl font-bold">Pokémon tidak ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;