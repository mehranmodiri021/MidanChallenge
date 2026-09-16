import React from 'react';
import { Trophy, Users, Clock, Flame, Sparkles, ChevronLeft, Ticket } from 'lucide-react';
import { Tournament } from '../types';

interface TournamentCardProps {
  tournament: Tournament;
  onEnter: (tournament: Tournament, useTicket?: boolean) => void;
  onViewLeaderboard: (tournament: Tournament) => void;
  userTickets: number;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  onEnter,
  onViewLeaderboard,
  userTickets,
}) => {
  const isFree = tournament.entryFee === 0;
  const isSponsored = tournament.category === 'sponsored';
  const isRapid = tournament.category === 'rapid';
  const isChampionship = tournament.category === 'championship';

  // Calculate percentage of filled spots
  const fillPercentage = Math.min(
    100,
    Math.round((tournament.participantsCount / tournament.maxParticipants) * 100)
  );

  // Format countdown
  const hours = Math.floor(tournament.endsInSeconds / 3600);
  const minutes = Math.floor((tournament.endsInSeconds % 3600) / 60);

  return (
    <div className="relative bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xl hover:border-slate-700 transition overflow-hidden">
      {/* Subtle glowing ambient gradient for championships and sponsored */}
      {isChampionship && (
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
      )}
      {isSponsored && (
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
      )}

      {/* Top Header Row: Badge & Timer */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {tournament.badge && (
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                isSponsored
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : isRapid
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : isChampionship
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {isSponsored && <Sparkles className="w-3 h-3" />}
              {isRapid && <Flame className="w-3 h-3" />}
              {isChampionship && <Trophy className="w-3 h-3" />}
              {tournament.badge}
            </span>
          )}

          {tournament.sponsorName && (
            <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60">
              {tournament.sponsorName}
            </span>
          )}
        </div>

        {/* Live Timer */}
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800/60 px-2 py-1 rounded-lg">
          <Clock className="w-3 h-3 text-sky-400" />
          <span>
            {hours > 0 ? `${hours} ساعت و ${minutes} دقیقه` : `${minutes} دقیقه مانده`}
          </span>
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="mb-3">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          {tournament.title}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
          {tournament.subtitle}
        </p>
      </div>

      {/* Prize Pool Display Box */}
      <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800/80 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            استخر کل جوایز:
          </span>
          <span className="text-base font-black text-amber-300 tracking-wide">
            {tournament.prizePool > 0
              ? `${tournament.prizePool.toLocaleString('fa-IR')} تومان`
              : 'تمرینی و ثبت رکورد'}
          </span>
        </div>

        {/* Prize Distribution Breakdown */}
        {tournament.prizePool > 0 && (
          <div className="grid grid-cols-3 gap-1.5 text-center pt-2 border-t border-slate-800/80 text-[11px]">
            <div className="bg-amber-500/10 rounded-lg py-1 border border-amber-500/20">
              <span className="block text-[10px] text-amber-400">مقام اول</span>
              <span className="font-bold text-slate-200">
                {tournament.firstPrize.toLocaleString('fa-IR')}
              </span>
            </div>
            <div className="bg-slate-800/50 rounded-lg py-1 border border-slate-700/40">
              <span className="block text-[10px] text-slate-400">مقام دوم</span>
              <span className="font-bold text-slate-200">
                {tournament.secondPrize.toLocaleString('fa-IR')}
              </span>
            </div>
            <div className="bg-slate-800/50 rounded-lg py-1 border border-slate-700/40">
              <span className="block text-[10px] text-slate-400">مقام سوم</span>
              <span className="font-bold text-slate-200">
                {tournament.thirdPrize > 0
                  ? tournament.thirdPrize.toLocaleString('fa-IR')
                  : '—'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Participants Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="flex items-center gap-1 text-[11px]">
            <Users className="w-3 h-3 text-slate-400" />
            شرکت‌کنندگان
          </span>
          <span className="font-medium text-[11px] text-slate-300">
            {tournament.participantsCount} از {tournament.maxParticipants} نفر
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              fillPercentage > 80
                ? 'bg-rose-500'
                : fillPercentage > 50
                ? 'bg-amber-400'
                : 'bg-sky-500'
            }`}
            style={{ width: `${fillPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Bottom Action Area: Enter Buttons & View Leaderboard */}
      <div className="flex items-center gap-2 pt-1">
        {/* Main Entry Button */}
        <button
          id={`enter-tournament-${tournament.id}`}
          onClick={() => onEnter(tournament)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold shadow-lg transition active:scale-[0.98] ${
            isSponsored
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500'
              : isFree
              ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sky-500/25 hover:from-sky-400 hover:to-indigo-500'
              : 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-amber-500/25 hover:from-amber-400 hover:to-orange-500'
          }`}
        >
          {isFree ? (
            <>
              <Sparkles className="w-4 h-4" />
              <span>ورود رایگان (شروع چالش)</span>
            </>
          ) : (
            <>
              <span>ورود: {tournament.entryFee.toLocaleString('fa-IR')} تومان</span>
            </>
          )}
        </button>

        {/* Free Ticket Option for paid tournaments if user has tickets */}
        {!isFree && userTickets > 0 && (
          <button
            id={`ticket-enter-${tournament.id}`}
            onClick={() => onEnter(tournament, true)}
            className="flex items-center gap-1 py-3 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition active:scale-95 whitespace-nowrap"
            title="استفاده از ۱ بلیت رایگان"
          >
            <Ticket className="w-4 h-4 text-amber-400" />
            <span>بلیت</span>
          </button>
        )}

        {/* View Leaderboard Button */}
        <button
          id={`leaderboard-${tournament.id}`}
          onClick={() => onViewLeaderboard(tournament)}
          className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition active:scale-95 flex items-center justify-center"
          title="مشاهده جدول امتیازات"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
