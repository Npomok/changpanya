// src/app/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // ✅ 1. เพิ่มตัวแปรเก็บข้อความค้นหา
  const [searchQuery, setSearchQuery] = useState('');

  // Background Slider
  const backgroundImages = [
    "/slides/dump_red1.jpg", 
    "/slides/dump_red2.jpg", 
    "/slides/dump_red3.jpg", 
  ];
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // โหลดข้อมูลตอนเริ่ม (เหมือนเดิม)
  useEffect(() => {
    fetchTrucks();
  }, []);

  // ✅ 2. ฟังก์ชันดึงข้อมูล (รองรับการค้นหา)
  const fetchTrucks = async (query = '') => {
    setLoading(true);
    
    let supabaseQuery = supabase
      .from('trucks')
      .select('*')
      .order('id', { ascending: false });

    // ถ้ามีการพิมพ์ค้นหา ให้เพิ่มคำสั่งกรอง (ilike แปลว่าค้นหาแบบเจอคำบางส่วนก็ได้)
    if (query.trim() !== '') {
      supabaseQuery = supabaseQuery.ilike('title', `%${query}%`);
    }

    const { data, error } = await supabaseQuery;
    
    if (!error) {
      setTrucks(data);
    }
    setLoading(false);
  };

  // ✅ 3. ฟังก์ชันกดปุ่มค้นหา
  const handleSearch = () => {
    fetchTrucks(searchQuery);
  };

  // ✅ 4. ฟังก์ชันกด Enter ที่ช่องค้นหา (จะได้ไม่ต้องเลื่อนเมาส์ไปกดปุ่ม)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getCoverImage = (images) => {
    if (!images || images.length === 0) return 'https://via.placeholder.com/400x300?text=No+Image';
    const firstPhoto = images.find(url => !url.match(/\.(mp4|webm|ogg|mov)$/i));
    return firstPhoto || 'https://via.placeholder.com/400x300?text=Video+Only';
  };

  return (
    <main className="min-h-screen bg-stone-50 font-sans text-slate-600">
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 transition-all duration-300 bg-emerald-900/90 backdrop-blur-md shadow-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
             {/* โลโก้ใหม่ */}
          <img 
            src="/logo1.png" 
            alt="Chang Panya Logo" 
            className="w-16 h-16  object-contain drop-shadow-xl hover:scale-105 transition duration-300" 
          />
             <div className="flex flex-col">
                <span className="text-xl font-serif tracking-[0.15em] text-white font-bold leading-none">CHANG PANYA</span>
                <span className="text-[12px] text-emerald-200 tracking-widest uppercase mt-1">รถดัมพ์ทางการเกษตรคุณภาพ</span>
             </div>
          </div>
          <div className="space-x-8 hidden md:block text-sm font-medium tracking-wide">
            <Link href="/" className="text-white/90 hover:text-white transition">หน้าแรก</Link>
            <Link href="/stock" className="text-white/90 hover:text-white transition">รถทั้งหมด</Link>
            <Link href="/contact" className="text-white/90 hover:text-white transition">ติดต่อเรา</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center justify-center text-center text-white overflow-hidden">
        {backgroundImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out transform ${
              index === currentBgIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/40 to-black/30 z-10"></div>
        
        {/* กล่องเนื้อหาและช่องค้นหา */}
        <div className="relative z-20 max-w-4xl mx-auto px-4 mt-20">
          <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 drop-shadow-lg tracking-tight">
            คัดสรรรถดัมพ์<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-white">คุณภาพเยี่ยม</span>
          </h2>
          <p className="text-emerald-50 mb-12 text-lg font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            เราสร้างและดูแลรถทุกคัน ตรวจเช็กละเอียดทุกจุด พร้อมส่งมอบความคุ้มค่าให้คุณ
          </p>
          
          {/* ✅ ส่วนช่องค้นหา (Search Box) แก้ใหม่ */}
          <div className="bg-white/10 p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-2xl max-w-xl mx-auto backdrop-blur-md border border-white/20">
            <input 
              type="text" 
              placeholder="ค้นหารุ่นที่ต้องการ..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown} // กด Enter เพื่อค้นหาได้
              className="flex-1 px-6 py-3 text-white placeholder-emerald-100/70 outline-none rounded-xl bg-transparent text-lg"
            />
            <button 
              onClick={handleSearch}
              className="bg-white text-emerald-900 font-bold px-8 py-3 rounded-xl hover:bg-emerald-50 transition shadow-lg"
            >
              ค้นหา
            </button>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="container mx-auto py-20 px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
             <h3 className="text-3xl font-serif font-bold text-emerald-950 mb-2">
               {searchQuery ? `ผลการค้นหา "${searchQuery}"` : 'รถแนะนำ'}
             </h3>
             <div className="h-1 w-20 bg-emerald-500 rounded-full"></div>
          </div>
          {searchQuery && (
             <button onClick={() => {setSearchQuery(''); fetchTrucks('');}} className="text-red-500 underline text-sm">
               ล้างคำค้นหา
             </button>
          )}
        </div>

        {loading ? (
           <div className="text-center py-20 text-slate-400 animate-pulse">กำลังค้นหาข้อมูล...</div>
        ) : trucks.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-xl text-slate-500">ไม่พบรถที่คุณค้นหา</p>
            <button onClick={() => {setSearchQuery(''); fetchTrucks('');}} className="text-emerald-600 mt-2 hover:underline">
               ดูรถทั้งหมด
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {trucks.map((truck) => (
              <Link 
                href={`/stock/${truck.id}`} 
                key={truck.id} 
                className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300 overflow-hidden group border border-emerald-50/50 block"
              >
                <div className="h-72 relative overflow-hidden bg-gray-200">
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-emerald-900 text-xs font-bold px-4 py-2 rounded-full z-10 shadow-sm uppercase tracking-wide">
                    {truck.tag || 'สินค้าแนะนำ'} 
                  </div>
                  <img 
                    src={getCoverImage(truck.images)} 
                    alt={truck.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Error'; }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                
                <div className="p-8">
                  <h4 className="font-bold text-xl mb-3 text-slate-800">{truck.title}</h4>
                  <div className="flex items-center text-slate-500 text-sm mb-6 gap-4">
                     <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span>{truck.province}</span>
                     <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span>ปี {truck.year}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                     <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-light uppercase">ราคา</span>
                        <span className="text-2xl font-bold text-emerald-700">{truck.price}</span>
                     </div>
                     <div className="bg-emerald-900 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-emerald-700 transition shadow-lg group-hover:rotate-45 duration-300">
                       &rarr;
                     </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}