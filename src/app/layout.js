// ไฟล์: src/app/layout.js
import './globals.css'
import Link from 'next/link'
import Footer from './components/Footer'; // ⭐ บรรทัดนี้ที่ขาดไปครับ! ต้องเรียกไฟล์มาก่อนถึงจะใช้ได้

export const metadata = {
  title: 'ช่างปัญญา รถดั๊มซิ่ง - ศูนย์รวมรถดั๊มมือสอง สุโขทัย',
  description: 'ซื้อ-ขาย รถดั๊ม รถบรรทุก 6 ล้อ 10 ล้อ สภาพนางฟ้า คัดเกรด A เจ้าของขายเอง ไม่ผ่านนายหน้า',
  keywords: ['รถดั๊ม', 'รถบรรทุกมือสอง', 'รถดั๊มซิ่ง', 'ช่างปัญญา', 'รถมือสองสุโขทัย'],
  openGraph: {
    title: 'ช่างปัญญา รถดั๊มซิ่ง - รถมือสองคุณภาพเยี่ยม',
    description: 'ศูนย์รวมรถดั๊มมือสองสภาพดี คัดเกรด A พร้อมใช้งาน',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className="bg-stone-50 text-slate-600 font-sans flex flex-col min-h-screen">
        
        <div className="flex-grow">
          {children}
        </div>

        {/* เรียกใช้ Footer ตรงนี้ (ตอนนี้ใช้ได้แล้ว เพราะ import มาแล้ว) */}
        <Footer />

      </body>
    </html>
  )
}