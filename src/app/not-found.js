import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 text-center p-4">
      <h2 className="text-6xl font-bold text-emerald-900 mb-4">404</h2>
      <p className="text-xl text-slate-600 mb-8">ขออภัย ไม่พบหน้าที่คุณค้นหา</p>
      <Link href="/" className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition shadow-lg">
        กลับไปหน้าแรก
      </Link>
    </div>
  )
}