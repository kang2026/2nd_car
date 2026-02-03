
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { GoogleGenAI } from "@google/genai";
import { CarInfo, ConsumableStatus } from '../types';

// 고해상도 차량 이미지 데이터베이스 (각 모델별 가장 정확한 사진 선별)
const CAR_DATABASE: Record<string, Record<string, { img: string, sub: string }>> = {
  "현대": {
    "아이오닉 6": { img: "https://images.unsplash.com/photo-1663243285942-da3075253018?auto=format&fit=crop&q=80&w=1200", sub: "프레스티지 롱레인지 • AWD" },
    "아이오닉 5": { img: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=1200", sub: "익스클루시브 롱레인지" },
    "디 올 뉴 그랜저": { img: "https://images.unsplash.com/photo-1707147714013-080be86a0767?auto=format&fit=crop&q=80&w=1200", sub: "캘리그래피 3.5 가솔린" },
    "캐스퍼": { img: "https://images.unsplash.com/photo-1633446841235-9856f709bc8f?auto=format&fit=crop&q=80&w=1200", sub: "인스퍼레이션 액티브" },
    "아반떼": { img: "https://images.unsplash.com/photo-1623660053917-a3848f38a539?auto=format&fit=crop&q=80&w=1200", sub: "N Line 인스퍼레이션" }
  },
  "기아": {
    "EV6": { img: "https://images.unsplash.com/photo-1634568019323-8356a1b02b55?auto=format&fit=crop&q=80&w=1200", sub: "GT-Line 어스 롱레인지" },
    "EV9": { img: "https://images.unsplash.com/photo-1691062060867-27958b97d287?auto=format&fit=crop&q=80&w=1200", sub: "GT-Line 4WD" },
    "더 뉴 쏘렌토": { img: "https://images.unsplash.com/photo-1606148301666-4beee08fcc2a?auto=format&fit=crop&q=80&w=1200", sub: "시그니처 하이브리드" }
  },
  "Tesla": {
    "Model 3": { img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1200", sub: "Long Range AWD" },
    "Model Y": { img: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=1200", sub: "Performance AWD" }
  }
};

const INITIAL_CAR: CarInfo = {
  brand: "현대",
  model: "아이오닉 6",
  subModel: "프레스티지 롱레인지 • AWD",
  imageUrl: "https://images.unsplash.com/photo-1663243285942-da3075253018?auto=format&fit=crop&q=80&w=1200",
  mileage: 15200,
  plateNumber: "123가 4567",
  deliveryDate: "2023-05-12",
  status: "최상",
  consumables: {
    engineOil: { lastChangedDate: "2024-01-10", lastChangedMileage: 10000, intervalMileage: 10000, intervalMonths: 12 },
    acFilter: { lastChangedDate: "2024-03-05", lastChangedMileage: 14000, intervalMileage: 15000, intervalMonths: 12 },
    tires: { lastChangedDate: "2023-05-12", lastChangedMileage: 0, intervalMileage: 40000, intervalMonths: 48 },
    brakePads: { lastChangedDate: "2023-05-12", lastChangedMileage: 0, intervalMileage: 30000, intervalMonths: 36 },
  }
};

const Dashboard: React.FC = () => {
  const [cars, setCars] = useState<CarInfo[]>([INITIAL_CAR]);
  const [selectedCarIndex, setSelectedCarIndex] = useState(0);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [washDate, setWashDate] = useState("2024-05-16");
  const [isWashPickerOpen, setIsWashPickerOpen] = useState(false);
  const [naverPrice, setNaverPrice] = useState("5,200");
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);
  const [editingConsumable, setEditingConsumable] = useState<keyof CarInfo['consumables'] | null>(null);

  useEffect(() => {
    if (selectedCarIndex >= cars.length) setSelectedCarIndex(0);
  }, [cars.length]);

  const car = cars[selectedCarIndex] || INITIAL_CAR;

  const updateCar = (updated: Partial<CarInfo>) => {
    const newCars = [...cars];
    newCars[selectedCarIndex] = { ...newCars[selectedCarIndex], ...updated };
    setCars(newCars);
  };

  const calculateNextMaintenance = (item: ConsumableStatus) => {
    const dateObj = new Date(item.lastChangedDate);
    dateObj.setMonth(dateObj.getMonth() + item.intervalMonths);
    return { dateLimit: dateObj.toISOString().split('T')[0], mileageLimit: item.lastChangedMileage + item.intervalMileage };
  };

  const fetchNaverPrice = async () => {
    setIsUpdatingPrice(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${car.brand} ${car.model} 중고차 시세(숫자만)`,
        config: { tools: [{ googleSearch: {} }] }
      });
      const priceText = response.text?.replace(/[^0-9]/g, '').slice(0, 4);
      if (priceText) setNaverPrice(parseInt(priceText).toLocaleString());
    } finally {
      setIsUpdatingPrice(false);
    }
  };

  const handleCarSelect = (brand: string, model: string) => {
    const dbEntry = CAR_DATABASE[brand]?.[model] || { img: INITIAL_CAR.imageUrl, sub: "프리미엄 트림" };
    const newCar: CarInfo = { 
      ...INITIAL_CAR, 
      brand, 
      model, 
      subModel: dbEntry.sub, 
      imageUrl: dbEntry.img, // 이미지 DB 연동 확실히 수행
      mileage: 0, 
      plateNumber: "신규 등록", 
      deliveryDate: new Date().toISOString().split('T')[0] 
    };
    const newCarsList = [...cars, newCar];
    setCars(newCarsList);
    setSelectedCarIndex(newCarsList.length - 1); // 새로 추가된 차량 즉시 선택
    setIsSelectorOpen(false);
  };

  const handleDeleteCar = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (cars.length <= 1) return alert("최소 한 대의 차량은 유지해야 합니다.");
    const newCars = cars.filter((_, i) => i !== index);
    setCars(newCars);
    if (selectedCarIndex === index) {
      setSelectedCarIndex(0);
    } else if (selectedCarIndex > index) {
      setSelectedCarIndex(selectedCarIndex - 1);
    }
  };

  return (
    <div className="p-8 md:p-12 flex flex-col gap-10">
      <header className="flex flex-wrap justify-between items-end gap-4 z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <h1 className="text-white text-4xl font-black leading-tight tracking-tight">내 차고</h1>
            <button 
              onClick={() => setIsSelectorOpen(true)}
              className="flex items-center gap-2 bg-[#1C260D] border border-primary/20 px-4 py-1.5 rounded-full shadow-sm hover:brightness-110 transition-all"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">garage</span>
              <span className="text-primary text-[13px] font-black uppercase tracking-tight">보유 차량: {cars.length}대</span>
            </button>
          </div>
          <p className="text-text-secondary text-sm font-medium">차량 상태와 가치를 효율적으로 관리하세요</p>
        </div>
        <button 
          onClick={() => setIsSelectorOpen(true)}
          className="flex items-center justify-center px-8 h-12 rounded-full bg-primary text-black font-black hover:scale-105 transition-all shadow-glow"
        >
          <span className="material-symbols-outlined text-base mr-2 font-black">add_circle</span>
          차량 추가
        </button>
      </header>

      {/* 메인 차량 사진 카드 */}
      <section className="bg-surface-dark rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl flex flex-col min-h-[550px]">
        {/* 차량 사진 영역 - key를 변경하여 컴포넌트 강제 리렌더링 (사진 연동 보장) */}
        <div 
          key={`${selectedCarIndex}-${car.imageUrl}`} 
          className="w-full h-[400px] relative cursor-pointer group bg-[#0F1419] overflow-hidden"
          onClick={() => setIsSelectorOpen(true)}
        >
          <img 
            src={car.imageUrl} 
            alt={car.model}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onLoad={(e) => (e.currentTarget.style.opacity = '1')}
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          <div className="absolute top-6 left-6 px-5 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-white text-[12px] font-black tracking-tight z-10">
            {car.brand} • {car.status}
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px] z-20">
            <div className="bg-white/10 border border-white/20 px-8 py-4 rounded-2xl flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">cached</span>
              <span className="text-white font-black text-lg">다른 차량으로 변경</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-10 flex flex-col justify-between gap-10 bg-gradient-to-b from-[#151E25] to-[#0E151A]">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-black text-white tracking-tighter">{car.model}</h2>
              <span className="px-4 py-1.5 rounded-xl bg-[#2A3626] text-[#A8C854] text-[11px] font-black uppercase tracking-widest border border-[#3E4D39]">Active</span>
            </div>
            <p className="text-text-secondary text-lg font-bold tracking-tight opacity-70">{car.subModel}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-12 border-t border-white/5 pt-10">
            <EditableStat label="주행거리" value={car.mileage.toLocaleString()} unit="km" isEditing={editingField === 'mileage'} onEdit={() => setEditingField('mileage')} onSave={(v) => { updateCar({ mileage: parseInt(v.replace(/,/g,'')) || 0 }); setEditingField(null); }} type="number" />
            <EditableStat label="차량번호" value={car.plateNumber} isEditing={editingField === 'plate'} onEdit={() => setEditingField('plate')} onSave={(v) => { updateCar({ plateNumber: v }); setEditingField(null); }} />
            <EditableStat label="출고일" value={car.deliveryDate} isEditing={editingField === 'delivery'} onEdit={() => setEditingField('delivery')} onSave={(v) => { updateCar({ deliveryDate: v }); setEditingField(null); }} type="date" />
            <EditableStat label="상태" value={car.status} isEditing={editingField === 'status'} onEdit={() => setEditingField('status')} onSave={(v) => { updateCar({ status: v as any }); setEditingField(null); }} options={['최상', '양호', '보통', '점검필요']} />
          </div>
        </div>
      </section>

      {/* 소모품 및 부가 정보 */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-surface-dark rounded-[2rem] p-10 border border-white/5 flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-[28px]">oil_barrel</span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">소모품 교환 현황</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {(Object.keys(car.consumables) as Array<keyof typeof car.consumables>).map((key) => {
              const names = { engineOil: '엔진오일', acFilter: '에어컨 필터', tires: '타이어', brakePads: '브레이크 패드' };
              const icons = { engineOil: 'oil_barrel', acFilter: 'air', tires: 'adjust', brakePads: 'disc_full' };
              return <ConsumableItem key={key} name={names[key]} status={car.consumables[key]} currentMileage={car.mileage} icon={icons[key]} next={calculateNextMaintenance(car.consumables[key])} onEdit={() => { setEditingConsumable(key); setIsSpecsModalOpen(true); }} />
            })}
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* 최근 세차일 카드 - 클릭 시만 달력 노출 */}
          <div className="bg-surface-dark rounded-[2rem] p-8 border border-white/5 flex flex-col gap-6">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                    <span className="material-symbols-outlined">local_car_wash</span>
                  </div>
                  <span className="text-lg font-black text-white tracking-tight">최근 세차일</span>
                </div>
                <button 
                  onClick={() => setIsWashPickerOpen(!isWashPickerOpen)}
                  className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center ${
                    isWashPickerOpen ? 'bg-primary text-black' : 'bg-white/5 text-text-secondary hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{isWashPickerOpen ? 'close' : 'edit_calendar'}</span>
                </button>
             </div>
             
             {isWashPickerOpen ? (
                <div className="bg-black/30 p-6 rounded-3xl border border-white/5 animate-in fade-in slide-in-from-top-4 duration-300">
                   <div className="grid grid-cols-7 gap-1 text-center mb-3">
                     {['일','월','화','수','목','금','토'].map(d => <span key={d} className="text-[10px] text-slate-600 font-black">{d}</span>)}
                   </div>
                   <div className="grid grid-cols-7 gap-1">
                     {Array.from({ length: 31 }, (_, i) => i + 1).map(d => {
                       const fullDate = `2024-05-${d.toString().padStart(2, '0')}`;
                       const isSelected = washDate === fullDate;
                       return (
                         <button 
                            key={d} 
                            onClick={() => { setWashDate(fullDate); setIsWashPickerOpen(false); }} 
                            className={`w-full aspect-square text-[11px] rounded-xl flex items-center justify-center transition-all ${
                              isSelected ? 'bg-primary text-black font-black shadow-glow' : 'text-slate-400 hover:bg-white/5'
                            }`}
                          >
                            {d}
                          </button>
                       );
                     })}
                   </div>
                </div>
             ) : (
                <div 
                  className="flex flex-col gap-2 p-6 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all group" 
                  onClick={() => setIsWashPickerOpen(true)}
                >
                   <p className="text-2xl md:text-3xl font-black text-white tracking-tighter group-hover:text-primary transition-colors">
                     {washDate.split('-')[0]}년 {washDate.split('-')[1]}월 {washDate.split('-')[2]}일
                   </p>
                   <p className="text-[12px] font-bold text-text-secondary uppercase tracking-widest opacity-60">클릭하여 세차일 수정</p>
                </div>
             )}
          </div>

          {/* 예상 판매가 (시세) */}
          <div className="bg-surface-dark rounded-[2rem] p-10 border border-white/5 flex flex-col gap-6 relative overflow-hidden group">
            <div className="flex justify-between items-start z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-green-500/10 text-green-400">
                  <span className="material-symbols-outlined text-[28px]">payments</span>
                </div>
                <span className="text-lg font-black text-white tracking-tight">예상 판매가</span>
              </div>
              <button 
                onClick={fetchNaverPrice} 
                disabled={isUpdatingPrice} 
                className="text-[11px] font-black text-white bg-[#03C75A] px-4 py-2 rounded-full hover:brightness-110 transition-all flex items-center gap-2"
              >
                {isUpdatingPrice ? '조회중...' : 'N 시세 갱신'}
              </button>
            </div>
            <div className="z-10 relative">
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-black tracking-tighter text-white">{naverPrice}</p>
                <span className="text-2xl font-black text-text-secondary opacity-50">만원</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 차량 관리/선택 모달 */}
      {isSelectorOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsSelectorOpen(false)}></div>
          <div className="bg-[#0B1116] border border-white/10 rounded-[2.5rem] w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col z-10 shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex flex-col">
                <h3 className="text-3xl font-black text-white uppercase tracking-tight">내 가고 관리</h3>
                <p className="text-text-secondary text-sm mt-1 font-medium">보유 차량 리스트 및 신규 추가</p>
              </div>
              <button onClick={() => setIsSelectorOpen(false)} className="w-12 h-12 rounded-full hover:bg-white/10 flex items-center justify-center text-text-secondary transition-all"><span className="material-symbols-outlined">close</span></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 flex flex-col gap-10">
              {/* 보유 리스트 섹션 */}
              <div className="flex flex-col gap-5">
                <h4 className="text-primary text-[11px] font-black uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">garage</span>
                  현재 등록된 차량 ({cars.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cars.map((c, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => { setSelectedCarIndex(idx); setIsSelectorOpen(false); }} 
                      className={`relative flex items-center gap-5 p-5 rounded-[1.5rem] border transition-all cursor-pointer group ${
                        selectedCarIndex === idx ? 'bg-primary border-primary text-black' : 'bg-white/5 border-white/5 text-white hover:border-white/20'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selectedCarIndex === idx ? 'bg-black/10' : 'bg-black/20 group-hover:bg-primary/10 transition-colors'}`}>
                        <span className="material-symbols-outlined text-[28px]">directions_car</span>
                      </div>
                      <div className="flex flex-col flex-1 truncate">
                        <p className="font-black text-lg leading-none mb-1 truncate">{c.model}</p>
                        <p className={`text-[12px] font-bold ${selectedCarIndex === idx ? 'text-black/60' : 'text-text-secondary'}`}>{c.plateNumber}</p>
                      </div>
                      <button 
                        onClick={(e) => handleDeleteCar(idx, e)} 
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          selectedCarIndex === idx ? 'text-black/40 hover:text-red-700 hover:bg-black/5' : 'text-text-secondary hover:text-red-500 hover:bg-red-500/10'
                        }`}
                      >
                        <span className="material-symbols-outlined">delete_forever</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 추가 가능한 차량 데이터베이스 */}
              <div className="flex flex-col gap-8">
                <h4 className="text-text-secondary text-[11px] font-black uppercase tracking-[0.2em] px-1 border-t border-white/5 pt-10">차량 신규 등록</h4>
                {Object.entries(CAR_DATABASE).map(([brand, models]) => (
                  <div key={brand} className="flex flex-col gap-4">
                    <p className="text-white text-md font-black flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                      {brand}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {Object.keys(models).map(m => (
                        <button 
                          key={m} 
                          onClick={() => handleCarSelect(brand, m)} 
                          className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-[13px] text-text-secondary font-black hover:text-primary hover:border-primary/50 transition-all active:scale-95"
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 소모품 상세 관리 모달 */}
      {isSpecsModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => { setIsSpecsModalOpen(false); setEditingConsumable(null); }}></div>
          <div className="bg-surface-dark border border-white/10 rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col z-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h3 className="text-3xl font-black text-white flex items-center gap-4"><span className="material-symbols-outlined text-primary text-[36px]">construction</span>정비 및 소모품 기록</h3>
              <button onClick={() => { setIsSpecsModalOpen(false); setEditingConsumable(null); }} className="w-14 h-14 rounded-full hover:bg-white/10 flex items-center justify-center text-text-secondary transition-colors"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="flex-1 overflow-y-auto p-12 flex flex-col gap-10">
              {(Object.keys(car.consumables) as Array<keyof typeof car.consumables>).map((key) => {
                const names = { engineOil: '엔진오일', acFilter: '에어컨 필터', tires: '타이어', brakePads: '브레이크 패드' };
                const c = car.consumables[key];
                return (
                  <div key={key} className={`p-8 rounded-[2rem] border transition-all ${editingConsumable === key ? 'border-primary bg-primary/5 ring-1 ring-primary/30 shadow-[0_0_30px_rgba(226,246,78,0.1)]' : 'border-white/5 bg-white/5'}`}>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xl font-black text-white tracking-tight">{names[key]}</span>
                      <span className="text-[12px] font-black text-primary bg-primary/10 px-4 py-1.5 rounded-full">최근 교체: {c.lastChangedMileage.toLocaleString()} km</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-3">
                        <label className="text-[11px] font-black text-text-secondary uppercase tracking-widest opacity-50">교체 날짜</label>
                        <input type="date" value={c.lastChangedDate} onChange={(e) => { const newCons = { ...car.consumables }; newCons[key].lastChangedDate = e.target.value; updateCar({ consumables: newCons }); }} className="bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-primary transition-all font-bold" />
                      </div>
                      <div className="flex flex-col gap-3">
                        <label className="text-[11px] font-black text-text-secondary uppercase tracking-widest opacity-50">누적 주행거리 (km)</label>
                        <input type="number" value={c.lastChangedMileage} onChange={(e) => { const newCons = { ...car.consumables }; newCons[key].lastChangedMileage = parseInt(e.target.value) || 0; updateCar({ consumables: newCons }); }} className="bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-primary transition-all font-bold" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-10 border-t border-white/5 flex justify-end bg-black/10">
              <button onClick={() => { setIsSpecsModalOpen(false); setEditingConsumable(null); }} className="px-12 py-4 bg-primary text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-glow">변경사항 저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EditableStat = ({ label, value, unit, isEditing, onEdit, onSave, options, type = 'text' }: any) => {
  const [val, setVal] = useState(value);
  return (
    <div className="flex flex-col gap-2 group relative">
      <span className="text-[11px] text-primary uppercase tracking-[0.2em] font-black opacity-80">{label}</span>
      {isEditing ? (
        <div className="flex items-center gap-2 animate-in fade-in duration-300">
          {options ? (
            <select autoFocus className="bg-background-dark border border-primary text-white text-sm rounded-xl px-3 py-1.5 outline-none" value={val} onChange={(e) => setVal(e.target.value)} onBlur={() => onSave(val)}>
              {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input autoFocus type={type} className="bg-background-dark border border-primary text-white text-md rounded-xl px-4 py-2 outline-none w-full font-bold" value={val} onChange={(e) => setVal(e.target.value)} onBlur={() => onSave(val)} onKeyDown={(e) => e.key === 'Enter' && onSave(val)} />
          )}
        </div>
      ) : (
        <div onClick={onEdit} className="text-white text-2xl font-black font-mono tracking-tight cursor-pointer hover:text-primary transition-colors flex items-center gap-3">
          {value} {unit && <span className="text-sm font-bold text-text-secondary uppercase opacity-50">{unit}</span>}
          <span className="material-symbols-outlined text-[18px] text-primary/40 group-hover:text-primary transition-colors">edit_square</span>
        </div>
      )}
    </div>
  );
};

const ConsumableItem = ({ name, status, currentMileage, icon, next, onEdit }: any) => {
  const remainingMileage = next.mileageLimit - currentMileage;
  const isWarning = remainingMileage < 1000;
  const progress = Math.max(0, Math.min(100, (remainingMileage / status.intervalMileage) * 100));
  return (
    <div className="bg-white/5 border border-white/5 hover:border-primary/20 p-6 rounded-[1.5rem] flex flex-col gap-5 cursor-pointer group transition-all" onClick={onEdit}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl bg-black/30 text-text-secondary group-hover:bg-primary group-hover:text-black transition-all shadow-sm`}>
            <span className="material-symbols-outlined text-xl">{icon}</span>
          </div>
          <span className="text-md font-black text-white">{name}</span>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-text-secondary group-hover:text-primary transition-all">
          <span className="material-symbols-outlined text-[20px]">more_vert</span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-baseline">
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black ${isWarning ? 'text-orange-500 animate-pulse' : 'text-white'} tracking-tighter`}>{remainingMileage.toLocaleString()}</span>
            <span className="text-[12px] font-black text-text-secondary uppercase opacity-50">km Left</span>
          </div>
          <span className={`text-[11px] font-black px-3 py-1 rounded-lg ${isWarning ? 'bg-orange-500/10 text-orange-500' : 'bg-primary/10 text-primary'}`}>{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden shadow-inner">
          <div className={`h-full rounded-full transition-all duration-1000 ease-out ${isWarning ? 'bg-gradient-to-r from-orange-600 to-red-500' : 'bg-primary'}`} style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex flex-wrap justify-between items-center mt-2">
          <div className="flex items-center gap-2 text-[11px] text-text-secondary font-black opacity-60">
            <span className="material-symbols-outlined text-[16px]">event</span>
            {next.dateLimit}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-text-secondary font-black opacity-60">
            <span className="material-symbols-outlined text-[16px]">route</span>
            {next.mileageLimit.toLocaleString()}km
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
