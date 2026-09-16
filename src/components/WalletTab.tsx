import React, { useState } from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle, Ticket, History, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserWallet, Transaction } from '../types';
import { sound } from '../utils/audio';

interface WalletTabProps {
  wallet: UserWallet;
  onDeposit: (amount: number) => void;
  onRequestCashout: (amount: number, cardNumber: string) => boolean;
  onOpenAdModal: () => void;
}

export const WalletTab: React.FC<WalletTabProps> = ({
  wallet,
  onDeposit,
  onRequestCashout,
  onOpenAdModal,
}) => {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showCashoutModal, setShowCashoutModal] = useState(false);

  // Cashout Form state
  const [cashoutAmount, setCashoutAmount] = useState<string>('50000');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cashoutSuccess, setCashoutSuccess] = useState<boolean>(false);
  const [cashoutError, setCashoutError] = useState<string>('');

  const handleDepositClick = (amount: number) => {
    onDeposit(amount);
    sound.playCash();
    setShowDepositModal(false);
  };

  const handleCashoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCashoutError('');
    const amt = parseInt(cashoutAmount, 10);
    if (isNaN(amt) || amt < 20000) {
      setCashoutError('حداقل مبلغ قابل تسویه ۲۰,۰۰۰ تومان است.');
      return;
    }
    if (amt > wallet.balance) {
      setCashoutError('مبلغ درخواستی بیشتر از موجودی قابل برداشت شماست.');
      return;
    }
    if (cardNumber.trim().length < 16) {
      setCashoutError('لطفاً شماره کارت ۱۶ رقمی یا شماره شبا معتبر وارد کنید.');
      return;
    }

    const ok = onRequestCashout(amt, cardNumber);
    if (ok) {
      setCashoutSuccess(true);
      sound.playCash();
      setTimeout(() => {
        setCashoutSuccess(false);
        setShowCashoutModal(false);
        setCardNumber('');
      }, 1600);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Wallet Balance Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-tr from-slate-900 via-indigo-950/70 to-slate-900 rounded-3xl p-5 border border-indigo-500/30 shadow-2xl">
        <div className="absolute top-0 left-0 -mt-8 -ml-8 w-40 h-40 bg-sky-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">موجودی کیف پول شما</span>
              <span className="text-2xl font-black text-white tracking-wide font-mono">
                {wallet.balance.toLocaleString('fa-IR')}{' '}
                <span className="text-xs font-normal text-slate-300">تومان</span>
              </span>
            </div>
          </div>

          {/* Quick Ticket Badge */}
          <div className="bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 rounded-xl text-center">
            <span className="text-[10px] text-amber-300 block">بلیت رایگان</span>
            <span className="text-sm font-black text-amber-400 flex items-center justify-center gap-1">
              <Ticket className="w-3.5 h-3.5" />
              {wallet.freeTickets}
            </span>
          </div>
        </div>

        {/* Total Statistics Row */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80 mb-4 text-xs">
          <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block">مجموع جوایز دریافتی</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">
              {wallet.totalWinnings.toLocaleString('fa-IR')} تومان
            </span>
          </div>
          <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block">تعداد مسابقات بازی‌شده</span>
            <span className="text-sm font-bold text-sky-400 font-mono">
              {wallet.tournamentsPlayed} مسابقه
            </span>
          </div>
        </div>

        {/* Deposit & Cashout Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            id="wallet-deposit-btn"
            onClick={() => setShowDepositModal(true)}
            className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition active:scale-95"
          >
            <ArrowDownCircle className="w-4 h-4" />
            <span>شارژ حساب (افزایش موجودی)</span>
          </button>
          <button
            id="wallet-cashout-btn"
            onClick={() => setShowCashoutModal(true)}
            className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition active:scale-95"
          >
            <ArrowUpCircle className="w-4 h-4 text-amber-400" />
            <span>درخواست تسویه و واریز</span>
          </button>
        </div>
      </div>

      {/* Rewarded Ad Promo Card for Free Tickets */}
      <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-300">نیاز به بلیت مسابقه دارید؟</h4>
            <p className="text-[11px] text-slate-300">
              با تماشای یک ویدیوی کوتاه اسپانسر، ۱ بلیت رایگان هدیه بگیرید.
            </p>
          </div>
        </div>
        <button
          id="get-free-ticket-btn"
          onClick={onOpenAdModal}
          className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 shadow-md transition active:scale-95"
        >
          مشاهده تبلیغ
        </button>
      </div>

      {/* Transactions History */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl">
        <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
          <History className="w-4 h-4 text-sky-400" />
          <span>تاریخچه تراکنش‌ها و جوایز</span>
        </h4>

        <div className="space-y-2">
          {wallet.transactions.map((tx) => {
            const isPositive = tx.type === 'deposit' || tx.type === 'win';
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/70 text-xs"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                      tx.type === 'win'
                        ? 'bg-amber-500/20 text-amber-400'
                        : tx.type === 'deposit'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : tx.type === 'payout'
                        ? 'bg-purple-500/20 text-purple-400'
                        : tx.type === 'ad_reward'
                        ? 'bg-sky-500/20 text-sky-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {tx.type === 'win' && '🏆'}
                    {tx.type === 'deposit' && '💳'}
                    {tx.type === 'payout' && '🏦'}
                    {tx.type === 'entry' && '🎯'}
                    {tx.type === 'ad_reward' && '🎟️'}
                  </div>
                  <div>
                    <span className="font-bold text-slate-200 block">{tx.description}</span>
                    <span className="text-[10px] text-slate-500">{tx.date}</span>
                  </div>
                </div>

                <div className="text-left">
                  {tx.amount !== 0 ? (
                    <span
                      className={`font-mono font-black text-xs ${
                        isPositive ? 'text-emerald-400' : 'text-slate-300'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {tx.amount.toLocaleString('fa-IR')} ت
                    </span>
                  ) : (
                    <span className="text-amber-400 text-[10px] font-bold">+۱ بلیت</span>
                  )}
                  <span className="text-[10px] text-emerald-500 block">تایید شده</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 1. DEPOSIT SIMULATOR MODAL */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl text-center">
            <h3 className="text-sm font-bold text-slate-100 mb-1">افزایش موجودی کیف پول</h3>
            <p className="text-xs text-slate-400 mb-4">
              مبلغ مورد نظر را جهت تست شارژ حساب انتخاب کنید:
            </p>

            <div className="space-y-2 mb-4">
              {[20000, 50000, 100000, 200000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleDepositClick(amt)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition active:scale-95 flex items-center justify-between"
                >
                  <span className="text-emerald-400">+ شارژ سریع</span>
                  <span className="font-mono">{amt.toLocaleString('fa-IR')} تومان</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowDepositModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 text-xs font-medium"
            >
              انصراف
            </button>
          </div>
        </div>
      )}

      {/* 2. CASHOUT / PAYOUT MODAL */}
      {showCashoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-100 mb-1 text-center">درخواست تسویه جایزه</h3>
            <p className="text-xs text-slate-400 mb-4 text-center">
              واریز آنی به حساب بانکی از طریق پایا/کارت‌به‌کارت
            </p>

            {cashoutSuccess ? (
              <div className="py-6 text-center text-emerald-400 space-y-2">
                <CheckCircle2 className="w-12 h-12 mx-auto animate-bounce" />
                <p className="text-xs font-bold">درخواست تسویه با موفقیت ثبت شد!</p>
                <p className="text-[10px] text-slate-400">مبلغ به حساب شما واریز گردید.</p>
              </div>
            ) : (
              <form onSubmit={handleCashoutSubmit} className="space-y-3">
                {cashoutError && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{cashoutError}</span>
                  </div>
                )}

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">مبلغ تسویه (تومان):</label>
                  <input
                    type="number"
                    value={cashoutAmount}
                    onChange={(e) => setCashoutAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-sky-500"
                    placeholder="مثال: ۵۰۰۰۰"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    موجودی قابل برداشت: {wallet.balance.toLocaleString('fa-IR')} تومان
                  </span>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    شماره کارت ۱۶ رقمی یا شماره شبا:
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    dir="ltr"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-sky-500 text-center tracking-widest"
                    placeholder="6037-99XX-XXXX-XXXX"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-md transition active:scale-95"
                  >
                    تایید و ثبت تسویه
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCashoutModal(false)}
                    className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs"
                  >
                    انصراف
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
