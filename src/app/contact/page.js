// src/app/contact/page.js
'use client';

import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-stone-50 font-sans text-slate-600 pb-20">
      
      {/* Navbar (เหมือนหน้าอื่น) */}
      <nav className="bg-emerald-900 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
             <img src="/logo1.png" alt="Logo" className="w-12 h-12 object-contain" />
             <span className="text-xl font-serif tracking-widest font-bold">CHANG PANYA</span>
          </Link>
          <Link href="/" className="text-sm border border-white/30 px-3 py-1 rounded hover:bg-white hover:text-emerald-900 transition">
            &larr; กลับหน้าแรก
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-emerald-800 text-white py-16 px-4 text-center relative overflow-hidden">
        <div className="relative z-10">
           <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">ติดต่อเรา</h1>
           <p className="text-emerald-100 text-lg">สอบถามรายละเอียด นัดดูรถ หรือปรึกษาเรื่องรถดั๊ม</p>
        </div>
        {/* ลายกราฟิกจางๆ ด้านหลัง */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </header>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* --- กล่องข้อมูลติดต่อ (ฝั่งซ้าย) --- */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-emerald-100">
             <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
               📞 ช่องทางติดต่อ
             </h2>
             
             <div className="space-y-6">
               {/* 1. เบอร์โทร */}
               <a href="tel:0802093458" className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition group cursor-pointer border border-emerald-100">
                  <div className="bg-emerald-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition">
                    📞
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">โทรสอบถาม (หรือคลิกที่นี่)</p>
                    <p className="text-xl font-bold text-emerald-900">080-209-3458</p>
                  </div>
               </a>

               {/* 2. เพจ (Facebook) */}
               <a href="https://www.facebook.com/profile.php?id=61584981843081&locale=th_TH" target="_blank" className="flex items-center gap-4 p-4 rounded-xl bg-[#06C755]/10 hover:bg-[#06C755]/20 transition group cursor-pointer border border-[#06C755]/20">
                  <div className="bg-[#06C755] text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition">
                    💬
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">เพจ Facebook(หรือคลิกที่นี่)</p>
                    <p className="text-xl font-bold text-[#06C755]">ช่างปัญญา เกษตรยนต์</p>
                  </div>
               </a>

               {/* 3. ที่อยู่ร้าน */}
               <div className="flex items-start gap-4 p-4">
                  <div className="bg-slate-200 text-slate-600 w-12 h-12 rounded-full flex items-center justify-center text-xl mt-1">
                    📍
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-800 mb-1">ร้านช่างปัญญา รถดัมพ์ทางการเกษตร</p>
                    <p className="text-slate-600 leading-relaxed">
                      ต.สามพวง อ.คีรีมาศ จ.สุโขทัย
                    </p>
                    <p className="text-sm text-emerald-600 mt-2">เปิดทุกวัน 08:00 - 18:00 น.</p>
                  </div>
               </div>
             </div>
          </div>

          {/* --- แผนที่ Google Maps (ฝั่งขวา) --- */}
          <div className="bg-white p-2 rounded-2xl shadow-xl border border-emerald-100 h-[500px] overflow-hidden relative">
             {/* วิธีเปลี่ยนแผนที่ให้เป็นร้านคุณจริงๆ:
                1. เข้า Google Maps ในคอม
                2. ค้นหาร้านคุณ หรือจิ้มจุดที่ต้องการ
                3. กดปุ่ม "แชร์" (Share) -> "ฝังแผนที่" (Embed a map)
                4. ก๊อปปี้โค้ด <iframe ...> มาวางแทนบรรทัดข้างล่างนี้
             */}
             <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3819.307750634114!2d99.81012247515197!3d16.81108208398115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30de4d8e667ea271%3A0xb63180031a5a03c2!2zTUTguYDguIHguKnguJXguKPguKLguJnguJXguYw!5e0!3m2!1sth!2sth!4v1765089850432!5m2!1sth!2sth" 
               width="100%" 
               height="100%" 
               style={{ border: 0 }} 
               allowFullScreen="" 
               loading="lazy" 
               referrerPolicy="no-referrer-when-downgrade"
               className="rounded-xl w-full h-full"
             ></iframe>
             
             <div className="absolute bottom-6 left-6 right-6">
                <a 
                  href="https://maps.app.goo.gl/hPqDj7yNxoSz77mR9" // ใส่ลิ้งค์ Google Map ร้านคุณตรงนี้
                  target="_blank"
                  className="block w-full bg-white/90 backdrop-blur text-emerald-900 font-bold py-3 rounded-xl shadow-lg text-center hover:bg-emerald-900 hover:text-white transition"
                >
                  นำทางไปที่ร้าน 🚗
                </a>
             </div>
          </div>  

        </div>
      </div>
    </main>
  );
}