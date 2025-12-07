// ไฟล์: src/app/stock/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient'; // ถอย 2 ครั้งสำหรับหน้านี้

export default function StockPage() {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // ฟังก์ชันดึงข้อมูลรถ
  const fetchTrucks = async (query = '') => {
    setLoading(true);
    let supabaseQuery = supabase
      .from('trucks')
      .select('*')
      .order('id', { ascending: false });

    if (query.trim() !== '') {
      supabaseQuery = supabaseQuery.ilike('title', `%${query}%`);
    }

    const { data, error } = await supabaseQuery;
    if (!error) {
      setTrucks(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrucks();
  }, []);

  // ฟังก์ชันเลือกรูปปก (กันวิดีโอ & กันรูปเสีย)
  const getCoverImage = (images) => {
    if (!images || images.length === 0) return 'https://via.placeholder.com/400x300?text=No+Image';
    // หาไฟล์ที่ไม่ใช่วิดีโอ
    const firstPhoto = images.find(url => !url.match(/\.(mp4|webm|ogg|mov)$/i));
    return firstPhoto || images[0];
  };

  return (
    <main className="min-h-screen bg-stone-50 font-sans text-slate-600 pb-20">
      
      {/* Navbar */}
      <nav className="bg-emerald-900 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
             <span className="text-xl font-serif tracking-widest font-bold">&larr; หน้าแรก</span>
          </Link>
          <div className="hidden md:block text-sm font-medium tracking-wide opacity-80">
            คลังสินค้าทั้งหมด
          </div>
        </div>
      </nav>

      {/* Header (แก้สีตัวหนังสือตรงนี้!) */}
      <div className="bg-white py-12 px-4 shadow-sm border-b border-emerald-100">
        <div className="container mx-auto text-center">
            {/* ใช้ text-emerald-900 (เขียวเข้มเกือบดำ) เพื่อให้อ่านชัดเจน */}
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-emerald-900">
              รถทั้งหมดในสต็อก
            </h1>
            <p className="text-slate-500">
              รวมรถดัมพ์คุณภาพดี พร้อมใช้งาน 
            </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        
        {/* ช่องค้นหา */}
        <div className="bg-white p-4 rounded-xl shadow-lg -mt-8 mb-10 border border-emerald-100 max-w-3xl mx-auto flex flex-col md:flex-row gap-4 relative z-10">
           <input 
              type="text" 
              placeholder="ค้นหารุ่นรถ... " 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchTrucks(searchQuery)}
              className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
           />
           <button 
              onClick={() => fetchTrucks(searchQuery)}
              className="bg-emerald-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-emerald-700 transition"
           >
              ค้นหา
           </button>
        </div>

        {/* รายการรถ */}
        {loading ? (
           <div className="text-center py-20 text-slate-400 animate-pulse">กำลังโหลดข้อมูล...</div>
        ) : trucks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-xl text-slate-500">ไม่พบรถที่คุณค้นหา</p>
            <button onClick={() => {setSearchQuery(''); fetchTrucks('');}} className="text-emerald-600 mt-2 hover:underline">
               ดูสินค้าทั้งหมด
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trucks.map((truck) => (
              <Link 
                href={`/stock/${truck.id}`} 
                key={truck.id} 
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-emerald-50/50 block h-full flex flex-col"
              >
                {/* ส่วนรูปภาพ */}
                <div className="h-64 relative overflow-hidden bg-gray-200">
                  <div className="absolute top-3 left-3 bg-emerald-900/90 text-white text-[10px] font-bold px-3 py-1 rounded-full z-10 shadow-sm uppercase tracking-wide">
                    {truck.tag || 'พร้อมขาย'} 
                  </div>
                  <img 
                    src={getCoverImage(truck.images)} 
                    alt={truck.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Error'; }}
                  />
                </div>
                
                {/* ส่วนเนื้อหา */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-slate-800 line-clamp-1">{truck.title}</h4>
                    <p className="text-xs text-slate-400 mb-4">จังหวัด: {truck.province} | ปี: {truck.year}</p>
                  </div>
                  
                  <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                     <div>
                        <p className="text-xs text-slate-400">ราคาขาย</p>
                        <p className="text-xl font-bold text-emerald-700">{truck.price}</p>
                     </div>
                     <span className="text-emerald-600 text-sm font-bold bg-emerald-50 px-3 py-1 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition">
                        ดูรายละเอียด &rarr;
                     </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}