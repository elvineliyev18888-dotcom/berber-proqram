'use client';
import { useState, useEffect } from 'react';
import { Plus, Calendar, DollarSign, Mic, FileText, Users } from 'lucide-react';

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

export default function CustomerHome() {
  const [secilenNomre, setSecilenNomre] = useState<string>('');
  const [daxilOlunub, setDaxilOlunub] = useState(false);
  const [gorusler, setGorusler] = useState<Gorus[]>([]);
  const [modalAciq, setModalAciq] = useState(false);

  const aylar = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
  const [secilenGunForma, setSecilenGunForma] = useState('12');
  const [secilenAyForma, setSecilenAyForma] = useState('Oktyabr');
  const [yeniSaat, setYeniSaat] = useState('12:00');
  const [zamanDilimi, setZamanDilimi] = useState('Səhər');
  const [yeniAd, setYeniAd] = useState('');
  const [yeniXidmet, setYeniXidmet] = useState('');

  // Dəyişiklik: Səhifə hər dəfə yenidən açıldıqda və ya başqa biri girdikdə avtomatik təmiz nömrə ekranı gəlir
  useEffect(() => {
    // localStorage-də əvvəl qalan sessiyanı təmizləyirik ki, başqasının nömrəsi qalmasın
    const saxlananNomre = sessionStorage.getItem('berber_aktiv_musteri_nomre');
    if (saxlananNomre) {
      setSecilenNomre(saxlananNomre);
      setDaxilOlunub(true);
      gorusleriYukle(saxlananNomre);
    }
  }, []);

  const gorusleriYukle = (nomre: string) => {
    const umumiGorusler = JSON.parse(localStorage.getItem('berber_baza_gorusler') || '[]');
    const menimGoruslerim = umumiGorusler.filter((g: Gorus) => g.nomre === nomre);
    setGorusler(menimGoruslerim);
  };

  const girisEt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secilenNomre) return;
    // Hər müştəri yalnız öz seans yaddaşında (sessionStorage) saxlanılır
    sessionStorage.setItem('berber_aktiv_musteri_nomre', secilenNomre);
    setDaxilOlunub(true);
    gorusleriYukle(secilenNomre);
  };

  const basqaNomreyeKec = () => {
    sessionStorage.removeItem('berber_aktiv_musteri_nomre');
    setDaxilOlunub(false);
    setSecilenNomre('');
    setGorusler([]);
  };

  const gorusYaddaSaxla = (e: React.FormEvent) => {
    e.preventDefault();
    if (!yeniAd) return;

    const tamTarix = `${secilenGunForma} ${secilenAyForma}`;
    const yeniGorus: Gorus = {
      id: Date.now(),
      userId: secilenNomre,
      tarix: tamTarix,
      saat: yeniSaat,
      zamanDilimi: zamanDilimi,
      musteri: yeniAd,
      nomre: secilenNomre,
      xidmet: yeniXidmet || 'Saç kəsimi',
      status: 'gozleyir',
    };

    const umumiGorusler = JSON.parse(localStorage.getItem('berber_baza_gorusler') || '[]');
    const yenilənmiş = [...umumiGorusler, yeniGorus];
    localStorage.setItem('berber_baza_gorusler', JSON.stringify(yenilənmiş));

    gorusleriYukle(secilenNomre);
    setModalAciq(false);
    setYeniXidmet('');
    setYeniAd('');
  };

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

      {/* Ekran Kontenti */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between p-6 md:p-12 max-w-[1200px] mx-auto">
        
        {!daxilOlunub ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-4 animate-bounce">💈</div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-wide mb-3 drop-shadow-md">
              Bərbər Növbə
            </h2>
            <p className="text-sm md:text-base text-gray-300 font-medium mb-8 max-w-sm drop-shadow">
              Öz randevularınızı görmək üçün mobil nömrənizi daxil edin
            </p>
            
            <form onSubmit={girisEt} className="w-full max-w-sm space-y-4">
              <input
                type="tel"
                placeholder="Mobil Nömrə (məs: 0501234567)"
                value={secilenNomre}
                onChange={(e) => setSecilenNomre(e.target.value)}
                className="w-full px-6 py-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-lg text-white font-bold placeholder:text-gray-300 outline-none focus:border-red-500 focus:bg-black/40 transition-all text-center shadow-lg"
                required
              />
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-4 rounded-2xl text-base shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                Giriş Et
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 drop-shadow-md">
                  <span className="text-red-500">💈</span> Şəxsi Kabinet
                </h1>
                <p className="text-sm md:text-base text-gray-300 font-bold mt-1">Nömrə: {secilenNomre}</p>
              </div>
              
              <button 
                onClick={basqaNomreyeKec} 
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-2xl text-white text-xs md:text-sm font-bold transition-all cursor-pointer"
              >
                Digər nömrə ilə daxil ol
              </button>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-black text-white text-2xl md:text-3xl drop-shadow">Randevu Siyahım</h3>
                  <p className="text-xs md:text-sm text-gray-300 font-semibold">Cəmi {gorusler.length} müraciət</p>
                </div>

                <button 
                  onClick={() => setModalAciq(true)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm font-extrabold px-5 py-3.5 rounded-2xl flex items-center gap-2 shadow-xl transition-all cursor-pointer hover:scale-105"
                >
                  <Plus size={20} /> Görüş Yaz
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {gorusler.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-gray-400 text-lg font-bold backdrop-blur-sm bg-black/20 rounded-3xl border border-white/10">
                    Sizin bu nömrə ilə aktiv randevunuz yoxdur.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gorusler.map((rand) => (
                      <div key={rand.id} className={`bg-black/50 backdrop-blur-md p-5 rounded-3xl border-l-4 border-t border-r border-b border-white/10 transition-all hover:bg-black/70 ${
                        rand.status === 'tesdiqlendi' ? 'border-l-emerald-500' : rand.status === 'redd_edildi' ? 'border-l-red-500' : 'border-l-amber-400'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-white text-xl">{rand.saat}</span>
                              <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded font-bold">{rand.zamanDilimi}</span>
                              <span className="text-xs text-gray-400">({rand.tarix})</span>
                            </div>
                            <h5 className="font-bold text-white text-lg mt-2">{rand.musteri}</h5>
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
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {modalAciq && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-white/20 w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-white">
              <h3 className="font-black text-white text-xl mb-4">Yeni Görüş Müraciəti</h3>
              <form onSubmit={gorusYaddaSaxla} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <select 
                    value={secilenGunForma} 
                    onChange={(e) => setSecilenGunForma(e.target.value)} 
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white font-bold outline-none"
                  >
                    {Array.from({ length: 31 }, (_, i) => (i + 1).toString()).map((g) => <option key={g} value={g} className="bg-gray-900">{g}</option>)}
                  </select>
                  <select 
                    value={secilenAyForma} 
                    onChange={(e) => setSecilenAyForma(e.target.value)} 
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white font-bold outline-none"
                  >
                    {aylar.map((a) => <option key={a} value={a} className="bg-gray-900">{a}</option>)}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    value={yeniSaat} 
                    onChange={(e) => setYeniSaat(e.target.value)} 
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white font-bold outline-none" 
                    required 
                  />
                  <div className="flex gap-1">
                    {['Səhər', 'Gündüz', 'Axşam'].map((d) => (
                      <button 
                        type="button" 
                        key={d} 
                        onClick={() => setZamanDilimi(d)} 
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${
                          zamanDilimi === d ? 'bg-red-600 text-white shadow-sm' : 'bg-white/10 text-gray-300 border border-white/10'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <input 
                  type="text" 
                  placeholder="Adınız və Soyadınız" 
                  value={yeniAd} 
                  onChange={(e) => setYeniAd(e.target.value)} 
                  className="w-full px-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white font-semibold placeholder:text-gray-400 outline-none focus:border-red-500" 
                  required 
                />
                
                <input 
                  type="text" 
                  placeholder="Xidmət növü (məs: Saç kəsimi)" 
                  value={yeniXidmet} 
                  onChange={(e) => setYeniXidmet(e.target.value)} 
                  className="w-full px-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white font-semibold placeholder:text-gray-400 outline-none focus:border-red-500" 
                  required 
                />

                <div className="flex gap-3 pt-3">
                  <button 
                    type="button" 
                    onClick={() => setModalAciq(false)} 
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm font-bold py-3.5 rounded-xl cursor-pointer"
                  >
                    Ləğv et
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-3.5 rounded-xl shadow-md cursor-pointer"
                  >
                    Göndər
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}