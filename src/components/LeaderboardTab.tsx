import React, { useState } from 'react';
import { Trophy, Medal, Flame, Sparkles, CheckCircle2, User } from 'lucide-react';
import { Tournament } from '../types';

interface LeaderboardTabProps {
  tournaments: Tournament[];
  selectedTournamentId?: string;
  onSelectTournament: (id: string) => void;
  onPlayTournament: (tournament: Tournament) => void;
}

export const LeaderboardTab: React.FC<LeaderboardTabProps> = ({
  tournaments,
  selectedTournamentId,
  onSelectTournament,
  onPlayTournament,
}) => {
  const activeTournament =
    tournaments.find((t) => t.id === selectedTournamentId) || tournaments[0];

  const [activeTabId, setActiveTabId] = useState<string>(activeTournament.id);

  const current = tournaments.find((t) => t.id === activeTabId) || activeTournament;
  const sortedEntries = [...current.leaderboard].sort((a, b) => b.score - a.score);

  const top1 = sortedEntries[0];
  const top2 = sortedEntries[1];
  const top3 = sortedEntries[2];
  const restEntries = sortedEntries.slice(3);

  return (
    <div className="space-y-4 pb-20">
      {/* Live Winners Ticker */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/15 to-amber-500/10 border border-amber-500/30 rounded-2xl p-3 flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 text-base">
          📢
        </span>
        <div className="overflow-hidden text-xs">
          <span className="text-[10px] text-amber-400 font-bold block">آخرین اهدای جایزه زنده</span>
          <p className="text-slate-200 truncate font-medium">
            تبریک به <strong className="text-amber-300">ارسلان_جت</strong> برای کسب رتبه اول و جایزه ۹۰,۰۰۰ تومانی!
          </p>
        </div>
      </div>

      {/* Tournament Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {tournaments.map((t) => {
          const isActive = t.id === current.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTabId(t.id);
                onSelectTournament(t.id);
              }}
              className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition active:scale-95 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 border border-sky-400/40'
                  : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {t.category === 'sponsored' && <Sparkles className="w-3.5 h-3.5" />}
              {t.category === 'rapid' && <Flame className="w-3.5 h-3.5" />}
              {t.category === 'championship' && <Trophy className="w-3.5 h-3.5" />}
              <span>{t.title}</span>
            </button>
          );
        })}
      </div>

      {/* Podium Display (Top 1, 2, 3) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-slate-100 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            سکوی برترین‌های {current.title}
          </h3>
          <span className="text-[11px] text-slate-400">
            استخر: {current.prizePool.toLocaleString('fa-IR')} تومان
          </span>
        </div>

        {/* 3-Column Podium */}
        <div className="grid grid-cols-3 gap-2 items-end pt-3 pb-2 text-center">
          {/* Rank 2 (Silver) */}
          {top2 && (
            <div className="flex flex-col items-center">
              <div className="relative mb-1">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border-2 border-slate-400/50 flex items-center justify-center text-xl shadow-lg">
                  {top2.avatar}
                </div>
                <span className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-300 text-slate-950 font-black text-[10px] flex items-center justify-center shadow">
                  ۲
                </span>
              </div>
              <span className="text-xs font-bold text-slate-200 mt-1 truncate max-w-[85px]">
                {top2.username}
              </span>
              <span className="text-[11px] font-mono text-sky-400 font-bold">
                {top2.score.toLocaleString('fa-IR')}
              </span>
              {top2.prize && top2.prize > 0 && (
                <span className="text-[10px] text-emerald-400 font-bold mt-0.5 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                  {top2.prize.toLocaleString('fa-IR')} ت
                </span>
              )}
            </div>
          )}

          {/* Rank 1 (Gold - Taller & Highlighted) */}
          {top1 && (
            <div className="flex flex-col items-center -mt-4">
              <div className="relative mb-1">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-amber-200 flex items-center justify-center text-2xl shadow-xl shadow-amber-500/30 animate-pulse">
                  {top1.avatar}
                </div>
                <span className="absolute -bottom-2 -right-1.5 w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg border border-white">
                  👑 ۱
                </span>
              </div>
              <span className="text-xs font-black text-amber-300 mt-1.5 truncate max-w-[95px]">
                {top1.username}
              </span>
              <span className="text-xs font-mono text-amber-400 font-extrabold">
                {top1.score.toLocaleString('fa-IR')}
              </span>
              {top1.prize && top1.prize > 0 && (
                <span className="text-[11px] text-emerald-300 font-extrabold mt-0.5 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  {top1.prize.toLocaleString('fa-IR')} تومان
                </span>
              )}
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {top3 && (
            <div className="flex flex-col items-center">
              <div className="relative mb-1">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border-2 border-amber-700/50 flex items-center justify-center text-xl shadow-lg">
                  {top3.avatar}
                </div>
                <span className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-700 text-white font-black text-[10px] flex items-center justify-center shadow">
                  ۳
                </span>
              </div>
              <span className="text-xs font-bold text-slate-200 mt-1 truncate max-w-[85px]">
                {top3.username}
              </span>
              <span className="text-[11px] font-mono text-sky-400 font-bold">
                {top3.score.toLocaleString('fa-IR')}
              </span>
              {top3.prize && top3.prize > 0 && (
                <span className="text-[10px] text-emerald-400 font-bold mt-0.5 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                  {top3.prize.toLocaleString('fa-IR')} ت
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl">
        <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
          <Medal className="w-4 h-4 text-sky-400" />
          <span>جدول کامل امتیازات و شرکت‌کنندگان</span>
        </h4>

        <div className="space-y-1.5">
          {sortedEntries.map((entry) => {
            const isUser = entry.isUser;
            return (
              <div
                key={`${entry.rank}-${entry.username}`}
                className={`flex items-center justify-between p-2.5 rounded-xl transition ${
                  isUser
                    ? 'bg-sky-500/20 border border-sky-400/40 shadow-md'
                    : 'bg-slate-950/60 border border-slate-800/60 hover:bg-slate-800/40'
                }`}
              >
                {/* Left: Rank & User */}
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                      entry.rank === 1
                        ? 'bg-amber-500 text-slate-950'
                        : entry.rank === 2
                        ? 'bg-slate-300 text-slate-950'
                        : entry.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {entry.rank}
                  </span>

                  <div className="text-lg">{entry.avatar}</div>

                  <div>
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-xs font-bold truncate max-w-[110px] ${
                          isUser ? 'text-sky-300' : 'text-slate-200'
                        }`}
                      >
                        {entry.username}
                      </span>
                      {isUser && (
                        <span className="text-[9px] bg-sky-500 text-white px-1.5 py-0.2 rounded-md font-bold">
                          شما
                        </span>
                      )}
                    </div>
                    {entry.timeAgo && (
                      <span className="text-[10px] text-slate-500 block">{entry.timeAgo}</span>
                    )}
                  </div>
                </div>

                {/* Right: Score & Prize */}
                <div className="text-left">
                  <span className="text-xs font-black font-mono text-slate-100 block">
                    {entry.score.toLocaleString('fa-IR')}
                  </span>
                  {entry.prize && entry.prize > 0 ? (
                    <span className="text-[10px] font-bold text-emerald-400">
                      +{entry.prize.toLocaleString('fa-IR')} ت
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500">امتیاز ثبت‌شده</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA To Play Tournament */}
      <button
        id="leaderboard-play-cta"
        onClick={() => onPlayTournament(current)}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-sky-500/25 transition active:scale-98 flex items-center justify-center gap-2"
      >
        <span>شروع رقابت در {current.title}</span>
        <Flame className="w-4 h-4 text-amber-300 fill-current" />
      </button>
    </div>
  );
};
