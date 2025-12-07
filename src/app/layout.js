// ไฟล์: src/app/layout.js
import './globals.css'
import Link from 'next/link'
import Footer from './components/Footer'; // ⭐ บรรทัดนี้ที่ขาดไปครับ! ต้องเรียกไฟล์มาก่อนถึงจะใช้ได้

export const metadata = {
  title: 'ช่างปัญญา รถดั๊มซิ่ง - ศูนย์รวมรถดัมพ์ทางการเกษตร สุโขทัย',
  description: 'ซื้อ-ขาย รถดัมพ์ทางเกษตร เจ้าของขายเอง ',
  keywords: ['รถดัมพ์', 'รถดัมพ์ซิ่ง', 'ช่างปัญญา', 'สุโขทัย'],
  openGraph: {
    title: 'ช่างปัญญา รถดัมพ์ทางการเกษตร',
    description: 'ศูนย์รวมรถดัมพ์สภาพดี พร้อมใช้งาน',
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