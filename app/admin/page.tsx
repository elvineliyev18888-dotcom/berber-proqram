'use client';
import { useState, useEffect } from 'react';
import { Check, X, Trash2, Phone, UserCheck, Shield } from 'lucide-react';
import Link from 'next/link';

interface Gorus {
  id: number;
  userId: string;
  tarix: string;
  saat: string;
  zamanDilimi: string;
  musteri: string;
  nomre: string;
  xidmet: string;
  status: 'gozleyir' | 'tesdiqlendi' | 'redd_edildi';
}

export default function AdminHome() {
  const [gorusler, setGorusler] = useState<Gorus[]>([]);

  useEffect(() => {
    bazaYukle();
  }, []);

  const bazaYukle = () => {
    const umumiGorusler = JSON.parse(localStorage.getItem('berber_baza_gorusler') || '[]');
    setGorusler(umumiGorusler);
  };

  const statusDeyis = (id: number, yeniStatus: 'tesdiqlendi' | 'redd_edildi') => {
    const umumiGorusler: Gorus[] = JSON.parse(localStorage.getItem('berber_baza_gorusler') || '[]');
    const yenilənmiş = umumiGorusler.map(g => g.id === id ? { ...g, status: yeniStatus } : g);
    localStorage.setItem('berber_baza_gorusler', JSON.stringify(yenilənmiş));
    setGorusler(yenilənmiş);
  };

  const gorusSil = (id: number) => {
    const umumiGorusler: Gorus[] = JSON.parse(localStorage.getItem('berber_baza_gorusler') || '[]');
    const yenilənmiş = umumiGorusler.filter(g => g.id !== id);
    localStorage.setItem('berber_baza_gorusler', JSON.stringify(yenilənmiş));
    setGorusler(yenilənmiş);
  };

  const tesdiqGorusler = gorusler.filter(g => g.status === 'tesdiqlendi');

  return (
    <div className="relative min-h-screen w-full font-sans overflow-x-hidden flex flex-col justify-between">
      
      {/* Canlı Video Fon */}
      <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-60"
        >
          <source src="/barber-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Admin Kontenti */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between p-6 md:p-12 max-w-[1200px] mx-auto gap-8">
        
        {/* Header Və Statistika */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 drop-shadow-md">
              <span className="text-red-500">💈</span> Admin Panel
            </h1>
            <p className="text-sm md:text-base text-gray-300 font-bold mt-1">Bütün Müştərilərin Müraciətləri</p>
          </div>
          
          <Link 
            href="/" 
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-2xl text-white text-xs md:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <UserCheck size={18} /> Müştəri Portalı
          </Link>
        </div>

        {/* Statistika Kartları */}
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div className="bg-black/40 backdrop-blur-md p-5 rounded-3xl border border-white/10 shadow-lg">
            <span className="text-xs tracking-wider text-emerald-400 font-bold uppercase">TƏSDİQLƏNƏN</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-1">{tesdiqGorusler.length}</h2>
          </div>
          <div className="bg-black/40 backdrop-blur-md p-5 rounded-3xl border border-white/10 shadow-lg">
            <span className="text-xs tracking-wider text-gray-400 font-bold uppercase">ÜMUMİ MÜRACİƏT</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-1">{gorusler.length}</h2>
          </div>
        </div>

        {/* Müraciətlərin Siyahısı */}
        <div className="flex-1 flex flex-col">
          <h3 className="font-black text-white text-2xl md:text-3xl mb-6 drop-shadow">Daxil Olan Bütün Müraciətlər</h3>

          <div className="flex-1 overflow-y-auto pb-10">
            {gorusler.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-400 text-lg font-bold backdrop-blur-sm bg-black/20 rounded-3xl border border-white/10">
                Hələ heç bir müraciət yoxdur.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gorusler.map((rand) => (
                  <div key={rand.id} className={`bg-black/50 backdrop-blur-md p-5 rounded-3xl border-l-4 border-t border-r border-b border-white/10 transition-all hover:bg-black/70 flex flex-col justify-between ${
                    rand.status === 'tesdiqlendi' ? 'border-l-emerald-500' : rand.status === 'redd_edildi' ? 'border-l-red-500' : 'border-l-amber-400'
                  }`}>
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-white text-xl">{rand.saat}</span>
                            <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded font-bold">{rand.zamanDilimi}</span>
                            <span className="text-xs text-gray-400">({rand.tarix})</span>
                          </div>
                          <h5 className="font-bold text-white text-lg mt-2">{rand.musteri}</h5>
                          <div className="flex items-center gap-1.5 text-sm text-emerald-400 font-extrabold mt-1">
                            <Phone size={14} /> {rand.nomre}
                          </div>
                          <span className="text-sm text-gray-300 font-medium block mt-1">Xidmət: {rand.xidmet}</span>
                        </div>

                        <span className={`text-[11px] px-3 py-1 rounded-full font-bold uppercase inline-block ${
                          rand.status === 'tesdiqlendi' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                          rand.status === 'redd_edildi' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {rand.status === 'tesdiqlendi' ? 'Təsdiqləndi' : rand.status === 'redd_edildi' ? 'Rədd Edildi' : 'Gözləyir'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">
                      <div className="flex gap-2">
                        {rand.status === 'gozleyir' && (
                          <>
                            <button onClick={() => statusDeyis(rand.id, 'tesdiqlendi')} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all">
                              <Check size={14} /> Təsdiqlə
                            </button>
                            <button onClick={() => statusDeyis(rand.id, 'redd_edildi')} className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-all">
                              <X size={14} /> Rədd et
                            </button>
                          </>
                        )}
                      </div>
                      <button onClick={() => gorusSil(rand.id)} className="text-gray-400 hover:text-red-400 cursor-pointer p-1.5 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}