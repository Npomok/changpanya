// src/app/components/Footer.js
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Footer() {
  const pathname = usePathname();

  // ⭐ ถ้าเป็นหน้า admin ให้ส่งค่าว่างกลับไป (ไม่โชว์ Footer)
  if (pathname.includes('/admin')) {
    return null;
  }

  // ถ้าไม่ใช่หน้า admin ให้โชว์ Footer ตามปกติ
  return (
    <footer className="bg-emerald-950 text-emerald-100 py-12 border-t-4 border-emerald-600 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* คอลัมน์ 1 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
               <img src="/logo1.png" alt="Logo" className="w-30 h-30 object-contain" />
               <h3 className="text-2xl font-serif font-bold text-white tracking-widest">CHANG PANYA</h3>
            </div>
            <p className="text-sm opacity-80 leading-relaxed font-light">
              แหล่งรวมรถดัมพ์ทางการเกษตรคุณภาพเยี่ยม  <br/>
              เจ้าของ ผลิตและขายเอง 
            </p>
          </div>
          {/* คอลัมน์ 2 */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 border-l-4 border-emerald-500 pl-3">เมนูนำทาง</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white">🏠 หน้าแรก</Link></li>
              <li><Link href="/stock" className="hover:text-white">🚛 รถทั้งหมด</Link></li>
              <li><Link href="/contact" className="hover:text-white">📞 ติดต่อเรา</Link></li>
            </ul>
          </div>
          {/* คอลัมน์ 3 */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 border-l-4 border-emerald-500 pl-3">ติดต่อสอบถาม</h4>
            <ul className="space-y-3 text-sm">
              <li>00900317698 , 0802093458 <br/></li>
              <li>ต.สามพวง อ.คีรีมาศ จ.สุโขทัย</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-emerald-900 pt-6 flex justify-between text-xs text-emerald-500">
          <p>&copy; {new Date().getFullYear()} ร้านช่างปัญญา รถดัมพ์.</p>
          <Link href="/admin" className="opacity-40 hover:opacity-100 hover:text-white">🔒 หลังบ้าน</Link>
        </div>
      </div>
    </footer>
  );
}