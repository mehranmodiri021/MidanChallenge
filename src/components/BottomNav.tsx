import React from 'react';
import { Trophy, Gamepad2, Flame, Wallet } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  freeTickets: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  freeTickets,
}) => {
  const tabs = [
    { id: 'tournaments' as ActiveTab, label: 'مسابقات', icon: Trophy },
    { id: 'game' as ActiveTab, label: 'میدان بازی', icon: Gamepad2, highlight: true },
    { id: 'leaderboard' as ActiveTab, label: 'رده‌بندی', icon: Flame },
    { id: 'wallet' as ActiveTab, label: 'کیف پول', icon: Wallet },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-lg border-t border-slate-800/80 px-4 py-2 select-none">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-btn-${tab.id}`}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-sky-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Highlight background pill for active tab */}
              {isActive && (
                <span className="absolute inset-0 bg-sky-500/10 rounded-2xl border border-sky-500/20 -z-10"></span>
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-sky-400' : ''
                  }`}
                />
                {tab.id === 'tournaments' && freeTickets > 0 && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                )}
              </div>

              <span
                className={`text-[10px] mt-1 font-bold ${
                  isActive ? 'text-sky-400 font-black' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
