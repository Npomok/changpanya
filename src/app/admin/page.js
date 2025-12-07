// ไฟล์: src/app/admin/page.js
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Data State
  const [trucks, setTrucks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '', price: '', year: '', province: '', description: '', tag: 'มาใหม่'
  });

  // ⭐ ตัวแปรจัดการรูปภาพ
  const [existingImages, setExistingImages] = useState([]); 
  const [selectedFiles, setSelectedFiles] = useState([]);   

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchTrucks();
    });
  }, []);

  const fetchTrucks = async () => {
    const { data, error } = await supabase.from('trucks').select('*').order('id', { ascending: false });
    if (!error) setTrucks(data);
  };

  const getThumbnail = (images) => {
    if (!images || images.length === 0) return null;
    const photo = images.find(url => !url.match(/\.(mp4|webm|ogg|mov)$/i));
    return photo || null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        alert('รหัสผ่านไม่ถูกต้อง หรือ อีเมลผิด');
    } else {
        window.location.reload();
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. อัปโหลดรูปใหม่ (ถ้ามี)
      let newImageUrls = [];
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const fileName = `${Date.now()}-${file.name}`;
          const { error } = await supabase.storage.from('truck-gallery').upload(fileName, file);
          if (!error) {
            const url = supabase.storage.from('truck-gallery').getPublicUrl(fileName).data.publicUrl;
            newImageUrls.push(url);
          }
        }
      }

      // 2. รวมรูป
      const finalImages = [...existingImages, ...newImageUrls];

      if (finalImages.length === 0) {
        setLoading(false);
        return alert('กรุณาเลือกรูปภาพอย่างน้อย 1 รูป');
      }

      const payload = { ...formData, images: finalImages };

      if (editingId) {
        await supabase.from('trucks').update(payload).eq('id', editingId);
        alert('✅ บันทึกการแก้ไขเรียบร้อย!');
      } else {
        await supabase.from('trucks').insert([payload]);
        alert('✅ ลงขายเรียบร้อย!');
      }

      // Reset Form
      setEditingId(null);
      setFormData({ title: '', price: '', year: '', province: '', description: '', tag: 'มาใหม่' });
      setExistingImages([]);
      setSelectedFiles([]);
      fetchTrucks();

    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (truck) => {
    setEditingId(truck.id);
    setFormData({
      title: truck.title, price: truck.price, year: truck.year, province: truck.province, description: truck.description, tag: truck.tag
    });
    setExistingImages(truck.images || []); 
    setSelectedFiles([]); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (confirm('ยืนยันลบรายการนี้?')) {
      await supabase.from('trucks').delete().eq('id', id);
      fetchTrucks();
    }
  };

  // ⭐⭐⭐ ส่วนที่แก้ไข: เพิ่มหน้าจอ Login กลับเข้ามา ⭐⭐⭐
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
            <h1 className="text-2xl font-bold text-emerald-800 mb-6 text-center">เข้าสู่ระบบหลังบ้าน</h1>
            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                    <input 
                        type="email" 
                        required
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                        placeholder="admin@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                    <input 
                        type="password" 
                        required
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                        placeholder="••••••••"
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg shadow-md transition transform active:scale-95"
                >
                    {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
                </button>
            </form>
        </div>
      </div>
    );
  }

  // ส่วนแสดงผลเมื่อ Login แล้ว (เหมือนเดิม)
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-600 pb-20">
      <nav className="bg-emerald-900 text-white p-4 shadow-md mb-8">
        <div className="container mx-auto flex justify-between items-center">
          <span className="font-bold text-xl">CHANG PANYA (Admin)</span>
          <button onClick={handleLogout} className="text-sm bg-red-500/20 px-3 py-1 rounded text-red-100 hover:bg-red-600">ออกจากระบบ</button>
        </div>
      </nav>

      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Form Area */}
        <div className={`bg-white p-8 rounded-2xl shadow-xl border mb-10 transition-all duration-300 ${editingId ? 'border-blue-600 ring-4 ring-blue-100' : 'border-emerald-100'}`}>
          <div className="flex justify-between items-center mb-6 border-b pb-4">
             <h1 className={`text-2xl font-bold ${editingId ? 'text-blue-700' : 'text-emerald-900'}`}>
               {editingId ? '✏️ กำลังแก้ไขข้อมูลรถ' : '📝 ลงขายรถใหม่'}
             </h1>
             {editingId && <button onClick={()=>{setEditingId(null); setFormData({title:'',price:'',year:'',province:'',description:'',tag:'มาใหม่'}); setExistingImages([]); setSelectedFiles([])}} className="text-red-500 underline text-sm">ยกเลิกแก้ไข</button>}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-bold mb-1">ชื่อรุ่นรถ</label><input type="text" value={formData.title} required onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-3 border rounded-lg" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-bold mb-1">ราคา</label><input type="text" value={formData.price} required onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full p-3 border rounded-lg" /></div>
              <div><label className="block text-sm font-bold mb-1">ปีจดทะเบียน</label><input type="text" value={formData.year} required onChange={(e) => setFormData({...formData, year: e.target.value})} className="w-full p-3 border rounded-lg" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div><label className="block text-sm font-bold mb-1">จังหวัด</label><input type="text" value={formData.province} required onChange={(e) => setFormData({...formData, province: e.target.value})} className="w-full p-3 border rounded-lg" /></div>
               <div><label className="block text-sm font-bold mb-1">สถานะ</label><select value={formData.tag} onChange={(e) => setFormData({...formData, tag: e.target.value})} className="w-full p-3 border rounded-lg"><option value="มาใหม่">🔥 มาใหม่</option><option value="แนะนำ">⭐ แนะนำ</option><option value="ขายด่วน">⚡ ขายด่วน</option></select></div>
            </div>
            
            {/* ส่วนจัดการรูปภาพ */}
            <div className={`p-5 rounded-xl border-2 border-dashed ${editingId ? 'bg-blue-50 border-blue-400' : 'bg-emerald-50 border-emerald-400'}`}>
              <label className="block text-base font-bold mb-3 text-slate-700">จัดการรูปภาพ/วิดีโอ</label>
              
              <div className="relative mb-4">
                <input type="file" multiple accept="image/*,video/*" onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                <div className={`w-full py-4 text-center rounded-lg font-bold border-2 ${editingId ? 'bg-white text-blue-600 border-blue-200' : 'bg-white text-emerald-600 border-emerald-200'} hover:shadow-md transition cursor-pointer`}>
                   + กดปุ่มนี้เพื่อเพิ่มรูปใหม่ (รูปเก่าจะไม่หาย)
                </div>
              </div>

              {(existingImages.length > 0 || selectedFiles.length > 0) && (
                <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {existingImages.map((url, index) => (
                    <div key={`old-${index}`} className="relative aspect-square group">
                      <div className="absolute top-0 left-0 bg-orange-500 text-white text-[9px] px-1 rounded-br z-10">รูปเดิม</div>
                      <img 
                        src={url} 
                        className="w-full h-full object-cover rounded-lg border-2 border-orange-200"
                        onError={(e) => {e.target.src = 'https://via.placeholder.com/100?text=Video'}}
                      />
                      <button type="button" onClick={() => removeExistingImage(index)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md hover:bg-red-800 transition font-bold border-2 border-white z-10">✕</button>
                    </div>
                  ))}
                  {selectedFiles.map((file, index) => (
                    <div key={`new-${index}`} className="relative aspect-square group">
                      <div className="absolute top-0 left-0 bg-emerald-500 text-white text-[9px] px-1 rounded-br z-10">รูปใหม่</div>
                      <img 
                        src={URL.createObjectURL(file)} 
                        className="w-full h-full object-cover rounded-lg border-2 border-emerald-200"
                        onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                        onError={(e) => {e.target.src = 'https://via.placeholder.com/100?text=New'}}
                      />
                      <button type="button" onClick={() => removeSelectedFile(index)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md hover:bg-red-800 transition font-bold border-2 border-white z-10">✕</button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="text-right mt-2 text-xs text-slate-400">
                  รวมทั้งหมด {existingImages.length + selectedFiles.length} รูป (เก่า {existingImages.length} + ใหม่ {selectedFiles.length})
              </div>
            </div>
            
            <div><label className="block text-sm font-bold mb-1">รายละเอียด</label><textarea rows="4" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 border rounded-lg"></textarea></div>
            
            {editingId ? (
              <button type="submit" disabled={loading} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-5 rounded-xl shadow-lg text-xl transition transform hover:scale-[1.01] border-b-4 border-blue-900">
                {loading ? '⏳ กำลังบันทึก...' : '💾 บันทึกการแก้ไข'}
              </button>
            ) : (
              <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-xl shadow-lg text-xl transition transform hover:scale-[1.01] border-b-4 border-emerald-800">
                {loading ? '⏳ กำลังอัปโหลด...' : '🚀 ลงขายทันที'}
              </button>
            )}

          </form>
        </div>

        {/* List Items */}
        <div className="bg-white rounded-xl shadow border border-emerald-100 overflow-hidden">
          <div className="bg-emerald-800 text-white px-4 py-3"><h3 className="font-bold">รายการรถในระบบ ({trucks.length})</h3></div>
          <div className="divide-y divide-gray-100">
            {trucks.map((truck) => {
              const thumbnail = getThumbnail(truck.images);
              return (
                <div key={truck.id} className="p-3 flex items-center justify-between hover:bg-gray-50 transition">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 overflow-hidden border border-gray-200 flex items-center justify-center">
                       {thumbnail ? (<img src={thumbnail} className="w-full h-full object-cover" onError={(e)=>{e.target.style.display='none'; e.target.parentElement.innerText='No Pic';}} />) : (<span className="text-[9px] text-gray-400">{truck.images?.length > 0 ? 'Video' : 'No Pic'}</span>)}
                    </div>
                    <div className="truncate">
                       <div className="flex items-center gap-2"><span className="font-bold text-slate-700 text-sm truncate">{truck.title}</span></div>
                       <div className="text-xs text-slate-500 mt-0.5"><span className="text-emerald-600 font-bold">{truck.price}</span></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                     <button onClick={() => handleEdit(truck)} className="text-sm font-medium text-blue-600 hover:underline">แก้ไข</button>
                     <button onClick={() => handleDelete(truck.id)} className="text-sm font-medium text-red-500 hover:underline">ลบ</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}