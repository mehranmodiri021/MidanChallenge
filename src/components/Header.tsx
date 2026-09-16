import React from 'react';
import { ShieldCheck, Volume2, VolumeX, Ticket, PlusCircle } from 'lucide-react';
import { UserWallet } from '../types';
import { sound } from '../utils/audio';

interface HeaderProps {
  wallet: UserWallet;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenWallet: () => void;
  onOpenAdModal: () => void;
  onOpenRules: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  wallet,
  soundEnabled,
  onToggleSound,
  onOpenWallet,
  onOpenAdModal,
  onOpenRules,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* User Info & Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-sky-500/20 border border-sky-400/30">
            {wallet.avatar}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-200 truncate max-w-[95px] sm:max-w-[130px]">
              {wallet.username}
            </span>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              آنلاین در لیگ
            </span>
          </div>
        </div>

        {/* Right Action Chips: Tickets & Wallet Balance */}
        <div className="flex items-center gap-1.5">
          {/* Free Tickets Chip */}
          <button
            id="header-tickets-btn"
            onClick={onOpenAdModal}
            className="flex items-center gap-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95"
            title="بلیت رایگان مسابقه (مشاهده تبلیغ)"
          >
            <Ticket className="w-3.5 h-3.5 text-amber-400" />
            <span>{wallet.freeTickets}</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1 rounded-md font-normal">+رایگان</span>
          </button>

          {/* Wallet Balance Chip */}
          <button
            id="header-wallet-btn"
            onClick={onOpenWallet}
            className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-100 px-2.5 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <span>{wallet.balance.toLocaleString('fa-IR')}</span>
            <span className="text-[10px] text-slate-400 font-normal">تومان</span>
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400 mr-0.5" />
          </button>

          {/* Sound Toggle */}
          <button
            id="header-sound-btn"
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 border border-slate-700/80 text-slate-300 transition active:scale-95"
            aria-label="تغییر صدا"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-sky-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Legal / Fair Play Info */}
          <button
            id="header-rules-btn"
            onClick={onOpenRules}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 border border-slate-700/80 text-emerald-400 transition active:scale-95"
            title="مرام‌نامه و چارچوب قانونی مسابقات"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
