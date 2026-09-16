import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Sparkles, ExternalLink, Ticket, Volume2 } from 'lucide-react';
import { SPONSOR_ADS } from '../data/initialData';
import { sound } from '../utils/audio';

interface RewardedAdModalProps {
  isOpen: boolean;
  onRewardClaimed: () => void;
  onClose: () => void;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  isOpen,
  onRewardClaimed,
  onClose,
}) => {
  const [countdown, setCountdown] = useState(5);
  const [canClaim, setCanClaim] = useState(false);
  const [adIndex, setAdIndex] = useState(0);

  const ad = SPONSOR_ADS[adIndex % SPONSOR_ADS.length];

  useEffect(() => {
    if (isOpen) {
      setCountdown(5);
      setCanClaim(false);
      setAdIndex((prev) => prev + 1);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanClaim(true);
            sound.playCash();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Top Ad Header Bar */}
        <div className="flex items-center justify-between p-3 bg-slate-950/70 border-b border-slate-800 text-xs">
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
            تبلیغات حامی مسابقه
          </span>

          <div className="flex items-center gap-2">
            {!canClaim ? (
              <span className="text-[11px] text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                دریافت جایزه در {countdown} ثانیه...
              </span>
            ) : (
              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                جایزه آماده شد!
              </span>
            )}

            {canClaim && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Ad Video / Creative Card Mockup */}
        <div className={`p-6 bg-gradient-to-br ${ad.bgColor} flex flex-col items-center text-center`}>
          <div className="w-16 h-16 rounded-2xl bg-slate-900/90 border border-slate-700 flex items-center justify-center text-3xl shadow-xl mb-3">
            {ad.icon}
          </div>

          <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider mb-1 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
            {ad.tag}
          </span>

          <h3 className="text-base font-black text-slate-100 mb-1">{ad.brand}</h3>
          <h4 className="text-xs font-bold text-amber-300 mb-2">{ad.headline}</h4>
          <p className="text-xs text-slate-300 max-w-xs leading-relaxed mb-4">{ad.body}</p>

          <a
            href="#sponsor"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-200 bg-slate-900/80 hover:bg-slate-900 px-4 py-2 rounded-xl border border-slate-700 transition"
          >
            <span>{ad.cta}</span>
            <ExternalLink className="w-3 h-3 text-sky-400" />
          </a>
        </div>

        {/* Bottom Reward Claim Area */}
        <div className="p-4 bg-slate-950 text-center border-t border-slate-800">
          {canClaim ? (
            <button
              id="claim-ad-reward-btn"
              onClick={() => {
                onRewardClaimed();
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-500/30 transition active:scale-95 flex items-center justify-center gap-2 animate-bounce"
            >
              <Ticket className="w-4 h-4" />
              <span>دریافت ۱ بلیت رایگان مسابقه</span>
              <Sparkles className="w-4 h-4" />
            </button>
          ) : (
            <div className="py-2 text-slate-500 text-xs flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>در حال تماشای تبلیغ اسپانسر... ({countdown} ثانیه)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
