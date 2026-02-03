
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: View.Dashboard, label: '대시보드', icon: 'dashboard' },
    { id: View.Maintenance, label: '정비 기록', icon: 'car_repair' },
    { id: View.CarWash, label: '세차 이력', icon: 'local_car_wash' },
    { id: View.Settings, label: '설정', icon: 'settings' },
  ];

  const avatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDs10LuA5eWc_p4nZ0s1OWNYxYETMeJmmoLccmObQk6qQ15lR1KJAMuLLzx6wLI0_HK3k3OPYVmvliEa8eOLy0SruBY9HC-qLN6ZFYOLhIe8QOsVvwYeMVTfJL0K5c8Xlvj3IRvJqSlvFc4wZNlfXA8idRFBtgeRejUlCs7hSffp1HYD_8Vj5cygJgAKeHXhkJNJySCsxPX3Bp-quD_HETouA-ZV98vDf8VNqLuZ20vA5OlZHBC8T-FISQbaGBSwNWOBKo-cEF2JOA";

  return (
    <aside className="hidden lg:flex w-72 flex-col border-r border-border-dark bg-[#13161b] h-screen sticky top-0">
      <div className="flex h-full flex-col justify-between p-6">
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-4 px-2">
            <div className="relative">
              <div 
                className="bg-center bg-no-repeat bg-cover rounded-full h-12 w-12 ring-2 ring-primary ring-offset-2 ring-offset-background-dark" 
                style={{ backgroundImage: `url("${avatarUrl}")` }}
              />
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-primary rounded-full border-2 border-[#13161b]"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white text-base font-bold leading-none mb-1">홍길동</h1>
              <p className="text-text-secondary text-xs font-medium tracking-wide">PREMIUM MEMBER</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
                  currentView === item.id
                    ? 'bg-primary text-black shadow-[0_0_15px_rgba(226,246,78,0.3)]'
                    : 'text-text-secondary hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined font-light">{item.icon}</span>
                <p className="text-sm font-bold tracking-tight">{item.label}</p>
              </button>
            ))}
          </nav>
        </div>

        <div className="px-2">
          <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-colors group">
            <span className="material-symbols-outlined text-[20px] group-hover:rotate-180 transition-transform duration-500">logout</span>
            <p className="text-sm font-medium">로그아웃</p>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
