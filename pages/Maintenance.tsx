
import React, { useState } from 'react';
import { MaintenanceRecord } from '../types';

const records: MaintenanceRecord[] = [
  { id: '1', part: '전면 브레이크 패드', desc: 'Brembo Ceramic High-Perf', cost: 120000, date: '2023.10.15', time: '오후 2:30', method: 'shop', icon: 'disc_full' },
  { id: '2', part: '에어컨 필터', desc: 'Bosch HEPA Filter', cost: 15000, date: '2023.09.01', time: '오전 10:15', method: 'self', icon: 'air' },
  { id: '3', part: '타이밍 벨트 세트', desc: 'OEM Replacement Kit', cost: 450000, date: '2023.06.20', time: '오후 4:00', method: 'shop', icon: 'settings_suggest' },
  { id: '4', part: '점화 플러그 (x4)', desc: 'NGK Iridium IX', cost: 88000, date: '2023.05.12', time: '오전 9:30', method: 'shop', icon: 'flash_on' },
];

const Maintenance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'parts' | 'supplies'>('parts');

  return (
    <div className="p-8 md:p-12 flex flex-col gap-8 max-w-[1200px] mx-auto w-full">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          정비 및 <span className="text-primary">소모품 이력</span>
        </h1>
        <p className="text-text-secondary text-lg">차량의 상태, 지출 비용 및 정비 내역을 체계적으로 관리하세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-dark border border-border-dark p-6 rounded-2xl flex flex-col justify-between group">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <p className="text-text-secondary text-xs font-bold uppercase tracking-widest">올해 총 정비 비용</p>
              <h3 className="text-white text-3xl font-bold tracking-tight mt-2">₩1,250,000</h3>
            </div>
            <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-black transition-all">
              <span className="material-symbols-outlined">payments</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border-dark flex items-center gap-2">
            <span className="text-[#0bda5b] bg-[#0bda5b]/10 px-2 py-0.5 rounded text-xs font-bold">5% ↗</span>
            <span className="text-text-secondary text-xs">지난달 대비 증가</span>
          </div>
        </div>
        <div className="hidden md:flex flex-col justify-center items-center rounded-2xl p-6 border border-border-dark border-dashed opacity-50">
          <span className="text-text-secondary text-sm">통계 위젯 준비 중</span>
        </div>
        <div className="hidden md:flex flex-col justify-center items-center rounded-2xl p-6 border border-border-dark border-dashed opacity-50">
          <span className="text-text-secondary text-sm">예약 위젯 준비 중</span>
        </div>
      </div>

      <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between items-center border-b border-border-dark">
          <div className="flex w-full lg:w-auto px-2">
            <TabButton 
              active={activeTab === 'parts'} 
              onClick={() => setActiveTab('parts')} 
              icon="build" 
              label="부품 교환" 
            />
            <TabButton 
              active={activeTab === 'supplies'} 
              onClick={() => setActiveTab('supplies')} 
              icon="oil_barrel" 
              label="소모품 교환" 
            />
          </div>
          <div className="flex items-center gap-3 p-4 w-full lg:w-auto">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">search</span>
              <input 
                type="text" 
                placeholder="부품명 검색..." 
                className="w-full lg:w-64 bg-background-dark border-border-dark rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-primary outline-none"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-border-dark rounded-lg text-text-secondary hover:text-white transition-all text-sm font-medium">
              <span className="material-symbols-outlined text-lg">calendar_today</span>
              필터
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background-dark/30 border-b border-border-dark">
                <th className="py-5 pl-8 text-[11px] font-bold uppercase tracking-widest text-text-secondary">교환 부품명</th>
                <th className="p-5 text-[11px] font-bold uppercase tracking-widest text-text-secondary">비용</th>
                <th className="p-5 text-[11px] font-bold uppercase tracking-widest text-text-secondary">날짜</th>
                <th className="p-5 text-[11px] font-bold uppercase tracking-widest text-text-secondary">업체/자가</th>
                <th className="p-5 pr-8 text-[11px] font-bold uppercase tracking-widest text-text-secondary text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-white/5 transition-colors group">
                  <td className="py-5 pl-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-[#1c2a38] text-text-secondary flex items-center justify-center group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-lg">{r.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-sm">{r.part}</span>
                        <span className="text-text-secondary text-xs">{r.desc}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-white font-medium text-sm">₩{r.cost.toLocaleString()}</td>
                  <td className="p-5">
                    <div className="flex flex-col">
                      <span className="text-text-secondary text-sm">{r.date}</span>
                      <span className="text-text-secondary/50 text-xs">{r.time}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      r.method === 'shop' 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                        : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>
                      <span className="material-symbols-outlined text-sm">{r.method === 'shop' ? 'storefront' : 'person'}</span>
                      {r.method === 'shop' ? '업체' : '자가'}
                    </span>
                  </td>
                  <td className="p-5 pr-8 text-right">
                    <button className="text-text-secondary hover:text-white transition-colors">
                      <span className="material-symbols-outlined">more_horiz</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`relative flex items-center justify-center px-6 py-5 transition-colors min-w-[120px] ${
      active ? 'text-white' : 'text-text-secondary hover:text-white'
    }`}
  >
    <div className="flex items-center gap-2 z-10">
      <span className={`material-symbols-outlined text-[20px] ${active ? 'text-primary' : ''}`}>{icon}</span>
      <span className="text-sm font-bold tracking-wide">{label}</span>
    </div>
    {active && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary shadow-glow"></div>}
  </button>
);

export default Maintenance;
