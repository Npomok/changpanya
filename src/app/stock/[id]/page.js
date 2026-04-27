// ไฟล์: src/app/stock/[id]/page.js
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
// จุดสำคัญ: ใช้ ../ 3 ครั้ง เพื่อถอยออกไปหา lib ให้เจอ
import { supabase } from '../../../lib/supabaseClient'; 

export default function TruckDetail({ params }) {
  const [truck, setTruck] = useState(null);
  const [mainMedia, setMainMedia] = useState(null); // รูปหรือวิดีโอที่โชว์อันใหญ่

  useEffect(() => {
    const fetchTruck = async () => {
      // รองรับ Next.js เวอร์ชั่นใหม่
      const resolvedParams = await params;
      
      const { data, error } = await supabase
        .from('trucks')
        .select('*')
        .eq('id', resolvedParams.id)
        .single();

      if (data) {
        setTruck(data);
        // เช็คว่ามีรูปกี่รูป
        if (data.images && data.images.length > 0) {
          // หาไฟล์ที่ไม่ใช่วิดีโอมาเป็นรูปแรก (ถ้ามี) เพื่อไม่ให้หน้าปกเป็นจอดำ
          const firstPhoto = data.images.find(url => !url.match(/\.(mp4|webm|ogg|mov)$/i));
          setMainMedia(firstPhoto || data.images[0]); 
        }
      }
    };
    fetchTruck();
  }, [params]);

  // ฟังก์ชันเช็คว่าเป็นวิดีโอไหม
  const isVideo = (url) => {
    return url && url.match(/\.(mp4|webm|ogg|mov)$/i);
  };

  if (!truck) return <div className="min-h-screen flex items-center justify-center text-slate-400">กำลังโหลดข้อมูล...</div>;

  return (
    <main className="min-h-screen bg-stone-50 font-sans text-slate-600 pb-20">
      
      {/* Navbar ด้านบน */}
      <nav className="bg-emerald-900 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/stock" className="flex items-center gap-2 hover:opacity-80 transition">
             <span className="text-xl font-serif tracking-widest font-bold">&larr; ย้อนกลับ</span>
          </Link>
          <div className="flex gap-4 text-sm">
            <Link href="/" className="hover:text-emerald-200">หน้าแรก</Link>
            <Link href="/contact" className="border border-white/30 px-3 py-1 rounded hover:bg-white hover:text-emerald-900 transition">ติดต่อเรา</Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        
        {/* Breadcrumb บอกตำแหน่งหน้า (แก้สีให้เข้มขึ้นแล้ว!) */}
        <div className="text-base font-medium text-emerald-800 mb-6 bg-emerald-100/50 p-3 rounded-lg inline-block border border-emerald-100">
           <Link href="/" className="hover:underline">หน้าแรก</Link> 
           <span className="mx-2 text-slate-400">/</span> 
           <Link href="/stock" className="hover:underline">รถทั้งหมด</Link> 
           <span className="mx-2 text-slate-400">/</span> 
           <span className="text-emerald-700 font-bold">{truck.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* --- ฝั่งซ้าย: แกลเลอรี่รูปภาพ & วิดีโอ --- */}
          <div>
            {/* จอใหญ่ (Main Viewer) */}
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl mb-4 border border-emerald-100 bg-black relative flex items-center justify-center group">
              {mainMedia ? (
                 isVideo(mainMedia) ? (
                  <video src={mainMedia} controls className="w-full h-full" autoPlay muted />
                ) : (
                  <img src={mainMedia} alt="Main" className="w-full h-full object-contain" />
                )
              ) : (
                <div className="text-white">ไม่มีรูปภาพ</div>
              )}
            </div>

            {/* รายการรูปเล็ก (Thumbnails) */}
            {/* ถ้ามีรูปมากกว่า 1 รูป ถึงจะโชว์อัลบั้มข้างล่าง */}
            {truck.images && truck.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {truck.images.map((media, index) => (
                  <div 
                    key={index} 
                    onClick={() => setMainMedia(media)}
                    className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 relative transition-all ${mainMedia === media ? 'border-emerald-600 opacity-100 ring-2 ring-emerald-200' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    {isVideo(media) ? (
                       // ไอคอน Play สำหรับวิดีโอ
                       <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white text-[10px]">
                          <span className="text-xl">▶</span>
                          <span>VIDEO</span>
                       </div>
                    ) : (
                      <img src={media} className="w-full h-full object-cover" />
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* บอกจำนวนรูป */}
            <p className="text-xs text-slate-400 mt-2 text-right">
              มีรูปทั้งหมด {truck.images ? truck.images.length : 0} ไฟล์
            </p>
          </div>

          {/* --- ฝั่งขวา: ข้อมูลรถ --- */}
          <div>
             <h1 className="text-3xl md:text-4xl font-serif font-bold text-emerald-950 mb-2">{truck.title}</h1>
             <div className="text-3xl font-bold text-emerald-700 mb-6 bg-emerald-50 inline-block px-4 py-2 rounded-lg border border-emerald-100">
                {truck.price} <span className="text-sm font-normal text-slate-500">-</span>
             </div>

             {/* กล่องสเปคย่อ */}
             <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 mb-8">
                <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2 border-b pb-2">
                  🛠️ ข้อมูลเบื้องต้น
                </h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                   <div>
                      <span className="text-xs text-slate-400 uppercase">ปีจดทะเบียน</span><br/>
                      <span className="font-bold text-slate-700">{truck.year}</span>
                   </div>
                   <div>
                      <span className="text-xs text-slate-400 uppercase">จังหวัด</span><br/>
                      <span className="font-bold text-slate-700">{truck.province}</span>
                   </div>
                   <div>
                      <span className="text-xs text-slate-400 uppercase">สถานะ</span><br/>
                      <span className="inline-block bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-bold">{truck.tag || 'พร้อมขาย'}</span>
                   </div>
                </div>
             </div>

             {/* รายละเอียด */}
             <div className="mb-8">
                <h3 className="font-bold text-lg mb-3 text-emerald-900">รายละเอียดเพิ่มเติม</h3>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                   <p className="leading-relaxed text-slate-600 whitespace-pre-line">{truck.description}</p>
                </div>
             </div>

             {/* ปุ่มติดต่อ (Sticky ในมือถือ) */}
             <div className="flex flex-col gap-3 sticky bottom-4 z-40 bg-white/90 backdrop-blur p-4 rounded-xl shadow-2xl border border-emerald-100 lg:static lg:bg-transparent lg:p-0 lg:shadow-none lg:border-0">
                <a href="tel:0802093458" className="bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2 transform active:scale-95">
                   📞 โทรสอบถามทันที
                </a>
                <a href="https://www.facebook.com/profile.php?id=61584981843081&locale=th_TH" target="_blank" className="bg-[#06C755] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#05b34c] transition flex items-center justify-center gap-2 transform active:scale-95">
                   💬 ทักไลน์ (เพจ Facebook)
                </a>
             </div>

          </div>
        </div>
      </div>
    </main>
  );
}