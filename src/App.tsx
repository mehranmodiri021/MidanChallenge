import React, { useState, useEffect } from 'react';
import { Trophy, Sparkles, PlusCircle, AlertCircle, Check, Ticket, HelpCircle } from 'lucide-react';
import { Header } from './components/Header';
import { TournamentCard } from './components/TournamentCard';
import { GameArena } from './components/GameArena';
import { LeaderboardTab } from './components/LeaderboardTab';
import { WalletTab } from './components/WalletTab';
import { BottomNav } from './components/BottomNav';
import { RewardedAdModal } from './components/RewardedAdModal';
import { FairPlayModal } from './components/FairPlayModal';
import { INITIAL_TOURNAMENTS, INITIAL_USER_WALLET } from './data/initialData';
import { Tournament, UserWallet, ActiveTab, Transaction } from './types';
import { sound } from './utils/audio';

export default function App() {
  // Local state initialized with localStorage fallback
  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    const saved = localStorage.getItem('skill_arena_tournaments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_TOURNAMENTS;
      }
    }
    return INITIAL_TOURNAMENTS;
  });

  const [wallet, setWallet] = useState<UserWallet>(() => {
    const saved = localStorage.getItem('skill_arena_wallet');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USER_WALLET;
      }
    }
    return INITIAL_USER_WALLET;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('tournaments');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(tournaments[0]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals state
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [pendingEntryTournament, setPendingEntryTournament] = useState<{
    tournament: Tournament;
    useTicket: boolean;
  } | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('skill_arena_tournaments', JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem('skill_arena_wallet', JSON.stringify(wallet));
  }, [wallet]);

  // Live countdown timer for active tournaments
  useEffect(() => {
    const timer = setInterval(() => {
      setTournaments((prev) =>
        prev.map((t) => ({
          ...t,
          endsInSeconds: t.endsInSeconds > 0 ? t.endsInSeconds - 1 : 86400,
        }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = () => {
    const nextState = sound.toggleSound();
    setSoundEnabled(nextState);
  };

  // 1. Enter Tournament Handler
  const handleEnterTournament = (tournament: Tournament, useTicket: boolean = false) => {
    if (tournament.entryFee === 0 || tournament.category === 'practice') {
      // Free or practice tournament -> launch immediately
      setSelectedTournament(tournament);
      setActiveTab('game');
      return;
    }

    // Paid tournament: confirm entry or use ticket
    setPendingEntryTournament({ tournament, useTicket });
  };

  const confirmTournamentEntry = () => {
    if (!pendingEntryTournament) return;
    const { tournament, useTicket } = pendingEntryTournament;

    if (useTicket) {
      if (wallet.freeTickets <= 0) {
        setIsAdModalOpen(true);
        setPendingEntryTournament(null);
        return;
      }

      // Deduct 1 free ticket
      setWallet((prev) => ({
        ...prev,
        freeTickets: prev.freeTickets - 1,
        tournamentsPlayed: prev.tournamentsPlayed + 1,
        transactions: [
          {
            id: `tx-${Date.now()}`,
            type: 'entry',
            amount: 0,
            description: `ورود با بلیت رایگان به ${tournament.title}`,
            date: 'هم‌اکنون',
            status: 'completed',
          },
          ...prev.transactions,
        ],
      }));
    } else {
      if (wallet.balance < tournament.entryFee) {
        // Insufficient funds, offer to deposit or watch ad
        alert('موجودی کیف پول شما کافی نیست. می‌توانید حساب خود را شارژ کرده یا با تماشای تبلیغ بلیت رایگان بگیرید.');
        setActiveTab('wallet');
        setPendingEntryTournament(null);
        return;
      }

      // Deduct entry fee
      setWallet((prev) => ({
        ...prev,
        balance: prev.balance - tournament.entryFee,
        tournamentsPlayed: prev.tournamentsPlayed + 1,
        transactions: [
          {
            id: `tx-${Date.now()}`,
            type: 'entry',
            amount: -tournament.entryFee,
            description: `هزینه ورودی ${tournament.title}`,
            date: 'هم‌اکنون',
            status: 'completed',
          },
          ...prev.transactions,
        ],
      }));
    }

    // Increment participants count
    setTournaments((prev) =>
      prev.map((t) =>
        t.id === tournament.id
          ? { ...t, participantsCount: Math.min(t.maxParticipants, t.participantsCount + 1) }
          : t
      )
    );

    setSelectedTournament(tournament);
    setPendingEntryTournament(null);
    setActiveTab('game');
  };

  // 2. Finish Game & Record Score
  const handleFinishGame = (finalScore: number, accuracy: number, maxCombo: number) => {
    if (!selectedTournament) return;

    const currentTourney = selectedTournament;

    // Check rank
    const existingEntries = currentTourney.leaderboard.filter((e) => !e.isUser);
    const userEntry = {
      rank: 1,
      username: `${wallet.username} (شما)`,
      avatar: wallet.avatar,
      score: finalScore,
      isUser: true,
      timeAgo: 'چند لحظه پیش',
      prize: 0,
    };

    const combined = [...existingEntries, userEntry].sort((a, b) => b.score - a.score);
    const newLeaderboard = combined.map((entry, idx) => {
      const rank = idx + 1;
      let prize = 0;
      if (currentTourney.prizePool > 0) {
        if (rank === 1) prize = currentTourney.firstPrize;
        else if (rank === 2) prize = currentTourney.secondPrize;
        else if (rank === 3) prize = currentTourney.thirdPrize;
      }
      return { ...entry, rank, prize };
    });

    const userRank = newLeaderboard.find((e) => e.isUser)?.rank || 1;
    const userPrize = newLeaderboard.find((e) => e.isUser)?.prize || 0;

    // Update Tournament
    setTournaments((prev) =>
      prev.map((t) => (t.id === currentTourney.id ? { ...t, leaderboard: newLeaderboard } : t))
    );

    // Update Wallet if prize won or new best score
    setWallet((prev) => {
      const updatedBest = Math.max(prev.bestScore, finalScore);
      let newBalance = prev.balance;
      let newWinnings = prev.totalWinnings;
      const newTransactions: Transaction[] = [...prev.transactions];

      if (userPrize > 0) {
        newBalance += userPrize;
        newWinnings += userPrize;
        newTransactions.unshift({
          id: `win-${Date.now()}`,
          type: 'win',
          amount: userPrize,
          description: `جایزه مقام ${userRank} در ${currentTourney.title}`,
          date: 'هم‌اکنون',
          status: 'completed',
        });
      }

      return {
        ...prev,
        bestScore: updatedBest,
        balance: newBalance,
        totalWinnings: newWinnings,
        transactions: newTransactions,
      };
    });
  };

  // 3. Deposit in Wallet
  const handleDeposit = (amount: number) => {
    setWallet((prev) => ({
      ...prev,
      balance: prev.balance + amount,
      transactions: [
        {
          id: `dep-${Date.now()}`,
          type: 'deposit',
          amount,
          description: 'شارژ کیف پول مسابقات (شتاب)',
          date: 'هم‌اکنون',
          status: 'completed',
        },
        ...prev.transactions,
      ],
    }));
  };

  // 4. Request Cashout
  const handleRequestCashout = (amount: number, cardNumber: string): boolean => {
    if (amount > wallet.balance) return false;

    setWallet((prev) => ({
      ...prev,
      balance: prev.balance - amount,
      transactions: [
        {
          id: `payout-${Date.now()}`,
          type: 'payout',
          amount: -amount,
          description: `درخواست تسویه جایزه به کارت ${cardNumber.slice(-4)}*`,
          date: 'هم‌اکنون',
          status: 'completed',
        },
        ...prev.transactions,
      ],
    }));
    return true;
  };

  // 5. Rewarded Ad Claim
  const handleClaimAdReward = () => {
    setWallet((prev) => ({
      ...prev,
      freeTickets: prev.freeTickets + 1,
      transactions: [
        {
          id: `ad-${Date.now()}`,
          type: 'ad_reward',
          amount: 0,
          description: 'دریافت ۱ بلیت رایگان با تماشای تبلیغ اسپانسر',
          date: 'هم‌اکنون',
          status: 'completed',
        },
        ...prev.transactions,
      ],
    }));
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex justify-center selection:bg-sky-500 selection:text-white">
      {/* Mobile-First Frame Constraint */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[#090d16] border-x border-slate-800/80 shadow-2xl relative">
        {/* Top App Header */}
        <Header
          wallet={wallet}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenWallet={() => setActiveTab('wallet')}
          onOpenAdModal={() => setIsAdModalOpen(true)}
          onOpenRules={() => setIsRulesModalOpen(true)}
        />

        {/* Main Body Content according to Active Tab */}
        <main className="flex-1 p-4 overflow-y-auto">
          {/* TAB 1: TOURNAMENTS LOBBY */}
          {activeTab === 'tournaments' && (
            <div className="space-y-4 pb-20">
              {/* Daily Free Ad-Supported Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600/20 via-teal-600/10 to-emerald-600/20 p-3.5 border border-emerald-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-xs font-black text-emerald-300">
                      جام روزانه رایگان اسپانسری فعال است!
                    </h2>
                    <p className="text-[11px] text-slate-300">
                      بدون پرداخت ورودی و با ۱ ویدیوی تبلیغاتی رقابت کنید.
                    </p>
                  </div>
                </div>
                <button
                  id="lobby-free-ad-ticket-btn"
                  onClick={() => setIsAdModalOpen(true)}
                  className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shrink-0 transition active:scale-95"
                >
                  دریافت بلیت
                </button>
              </div>

              {/* Tournament Section Title */}
              <div className="flex items-center justify-between pt-1">
                <h2 className="text-sm font-black text-slate-100 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  تورنمنت‌های فعال و استخرهای جایزه
                </h2>
                <span className="text-[11px] text-slate-400 font-medium">
                  {tournaments.length} چالش فعال
                </span>
              </div>

              {/* Tournament Cards List */}
              <div className="space-y-3.5">
                {tournaments.map((tournament) => (
                  <TournamentCard
                    key={tournament.id}
                    tournament={tournament}
                    userTickets={wallet.freeTickets}
                    onEnter={handleEnterTournament}
                    onViewLeaderboard={(t) => {
                      setSelectedTournament(t);
                      setActiveTab('leaderboard');
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PLAYABLE GAME ARENA */}
          {activeTab === 'game' && (
            <div className="pb-20">
              <GameArena
                tournament={selectedTournament}
                onFinishGame={handleFinishGame}
                onExit={() => setActiveTab('tournaments')}
              />
            </div>
          )}

          {/* TAB 3: LEADERBOARD & WINNERS */}
          {activeTab === 'leaderboard' && (
            <LeaderboardTab
              tournaments={tournaments}
              selectedTournamentId={selectedTournament?.id}
              onSelectTournament={(id) => {
                const found = tournaments.find((t) => t.id === id);
                if (found) setSelectedTournament(found);
              }}
              onPlayTournament={(t) => {
                handleEnterTournament(t);
              }}
            />
          )}

          {/* TAB 4: WALLET & CASHOUT */}
          {activeTab === 'wallet' && (
            <WalletTab
              wallet={wallet}
              onDeposit={handleDeposit}
              onRequestCashout={handleRequestCashout}
              onOpenAdModal={() => setIsAdModalOpen(true)}
            />
          )}
        </main>

        {/* Fixed Mobile Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={(tab) => {
            setActiveTab(tab);
          }}
          freeTickets={wallet.freeTickets}
        />

        {/* PENDING ENTRY CONFIRMATION MODAL */}
        {pendingEntryTournament && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 text-2xl">
                🎯
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-1">
                ورود به {pendingEntryTournament.tournament.title}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                استخر جوایز:{' '}
                <strong className="text-amber-300">
                  {pendingEntryTournament.tournament.prizePool.toLocaleString('fa-IR')} تومان
                </strong>
              </p>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 mb-4 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>هزینه ورودی:</span>
                  <span className="font-bold text-slate-200">
                    {pendingEntryTournament.tournament.entryFee.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>موجودی فعلی شما:</span>
                  <span className="font-bold text-emerald-400">
                    {wallet.balance.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
                {wallet.freeTickets > 0 && (
                  <div className="flex justify-between text-amber-300 pt-1 border-t border-slate-800">
                    <span>بلیت‌های رایگان شما:</span>
                    <span className="font-bold">{wallet.freeTickets} بلیت</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  id="confirm-entry-pay-btn"
                  onClick={confirmTournamentEntry}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition active:scale-95"
                >
                  {pendingEntryTournament.useTicket
                    ? 'استفاده از ۱ بلیت رایگان و شروع'
                    : `پرداخت ${pendingEntryTournament.tournament.entryFee.toLocaleString('fa-IR')} تومان و شروع`}
                </button>

                {wallet.freeTickets > 0 && !pendingEntryTournament.useTicket && (
                  <button
                    onClick={() =>
                      setPendingEntryTournament({
                        ...pendingEntryTournament,
                        useTicket: true,
                      })
                    }
                    className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition active:scale-95 flex items-center justify-center gap-1.5 border border-amber-500/30"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>ورود با بلیت رایگان (بدون کسر موجودی)</span>
                  </button>
                )}

                <button
                  onClick={() => setPendingEntryTournament(null)}
                  className="w-full py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        )}

        {/* REWARDED AD MODAL (Watch ad to get 1 free ticket) */}
        <RewardedAdModal
          isOpen={isAdModalOpen}
          onRewardClaimed={handleClaimAdReward}
          onClose={() => setIsAdModalOpen(false)}
        />

        {/* FAIR PLAY & LEGAL RULES MODAL */}
        <FairPlayModal
          isOpen={isRulesModalOpen}
          onClose={() => setIsRulesModalOpen(false)}
        />
      </div>
    </div>
  );
}
