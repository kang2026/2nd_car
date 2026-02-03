
import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Cell } from 'recharts';

const washData = [
  { month: '5월', val: 120000 },
  { month: '6월', val: 95000 },
  { month: '7월', val: 70000 },
  { month: '8월', val: 135000 },
  { month: '9월', val: 55000 },
  { month: '10월', val: 145000 },
];

const CarWash: React.FC = () => {
  return (
    <div className="p-8 md:p-12 flex flex-col gap-8 max-w-[1300px] mx-auto w-full">
      <div className="flex flex-wrap justify-between items-end gap-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">세차 이력 관리</h1>
          <p className="text-text-secondary text-lg">세차 빈도, 종류 및 비용을 한눈에 확인하세요.</p>
        </div>
        <button className="flex items-center gap-2 h-12 px-6 bg-primary text-black font-bold rounded-xl shadow-glow hover:scale-105 transition-all">
          <span className="material-symbols-outlined">add</span>
          세차 기록 추가
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-dark border border-border-dark rounded-2xl p-7">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white">2023년 10월</h3>
              <div className="flex gap-2">
                <button className="p-1.5 rounded-lg hover:bg-white/5 text-text-secondary"><span className="material-symbols-outlined">chevron_left</span></button>
                <button className="p-1.5 rounded-lg hover:bg-white/5 text-text-secondary"><span className="material-symbols-outlined">chevron_right</span></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center text-[11px] font-bold text-slate-500 uppercase mb-4">
              {['일', '월', '화', '수', '목', '금', '토'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-y-3 gap-x-2 text-center text-sm">
              <div className="h-10 w-10"></div><div className="h-10 w-10"></div>
              {[...Array(31)].map((_, i) => {
                const day = i + 1;
                const hasWash = [5, 10, 15, 24].includes(day);
                return (
                  <div key={day} className={`h-10 w-10 flex items-center justify-center rounded-full transition-all relative ${
                    day === 10 ? 'bg-primary text-black font-bold shadow-glow' : 'text-slate-400 hover:bg-white/5 cursor-pointer'
                  }`}>
                    {day}
                    {hasWash && day !== 10 && <span className="absolute bottom-1.5 h-1.5 w-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(226,246,78,0.8)]"></span>}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-surface-dark border border-border-dark rounded-2xl p-7 flex-1">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-text-secondary text-sm font-medium mb-1">월별 세차 지출</p>
                <h3 className="text-3xl font-black text-white">₩145,000</h3>
                <div className="flex gap-1.5 items-center mt-1 text-primary text-sm font-bold">
                  <span className="material-symbols-outlined text-lg">trending_up</span>
                  <span>지난달 대비 +12%</span>
                </div>
              </div>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={washData}>
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} content={<></>} />
                  <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                    {washData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 5 ? '#E2F64E' : 'rgba(226, 246, 78, 0.4)'} />
                    ))}
                  </Bar>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#8B9BB4', fontSize: 11}} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-7 flex flex-col h-full bg-surface-dark border border-border-dark rounded-2xl overflow-hidden">
          <div className="p-7 border-b border-border-dark flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">최근 활동</h3>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-border-dark rounded-lg text-text-secondary text-sm hover:text-white transition-all"><span className="material-symbols-outlined text-lg">filter_list</span>필터</button>
            </div>
          </div>
          <div className="p-3 flex-1 flex flex-col gap-3 overflow-y-auto">
            <WashItem 
              icon="water_drop" 
              title="프리미엄 손세차" 
              date="10월 24일, 2023" 
              shop="스파클 오토 디테일링" 
              type="손세차" 
              price="₩45,000" 
              highlight 
            />
            <WashItem 
              icon="local_car_wash" 
              title="퀵 린스" 
              date="10월 15일, 2023" 
              shop="주유소 세차장" 
              type="자동 세차" 
              price="₩12,000" 
            />
            <WashItem 
              icon="water_drop" 
              title="풀 디테일링" 
              date="10월 05일, 2023" 
              shop="오토 스파 센터" 
              type="손세차" 
              price="₩85,000" 
              highlight
            />
            <WashItem 
              icon="local_car_wash" 
              title="기본 세차" 
              date="9월 28일, 2023" 
              shop="BP 커넥트" 
              type="자동 세차" 
              price="₩10,000" 
            />
          </div>
          <button className="p-6 text-sm font-bold text-primary hover:text-primary-hover border-t border-border-dark flex items-center justify-center gap-2 transition-colors">
            전체 내역 보기
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const WashItem = ({ icon, title, date, shop, type, price, highlight }: any) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all cursor-pointer group">
    <div className="flex items-center gap-5">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${
        highlight ? 'bg-primary/20 text-primary' : 'bg-white/5 text-slate-400'
      }`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-white font-bold text-lg leading-none">{title}</p>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">calendar_today</span>{date}</span>
          <span className="opacity-30">•</span>
          <span>{shop}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between sm:justify-end gap-6">
      <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 text-slate-300">{type}</span>
      <p className={`font-bold text-xl tracking-tight ${highlight ? 'text-primary' : 'text-white'}`}>{price}</p>
    </div>
  </div>
);

export default CarWash;
