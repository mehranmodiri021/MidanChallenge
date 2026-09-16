import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, X, Scale, Award } from 'lucide-react';

interface FairPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FairPlayModal: React.FC<FairPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
      <div className="relative w-full max-w-sm max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">مرام‌نامه و چارچوب قانونی مسابقات</h3>
              <span className="text-[10px] text-emerald-400 font-medium">مسابقات مهارتی (Game of Skill)</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3 overflow-y-auto text-xs text-slate-300 leading-relaxed">
          {/* Box 1: Why it is 100% legal */}
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1 text-xs">
              <Scale className="w-4 h-4" />
              تفاوت حقوقی مسابقه مهارت با قمار و بخت‌آزمایی
            </h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              در قوانین بانکی و قضایی، فعالیت‌هایی که نتیجه آن‌ها بر پایه شانس (تاس، گردونه، قرعه‌کشی، بازی ورق) تعیین شود قمار محسوب می‌گردد. در نقطه مقابل، رویدادهایی که پیروزی در آن‌ها متکی بر <strong>مهارت فردی، سرعت عمل، حافظه و تمرکز</strong> باشد (نظیر شطرنج، مسابقات رباتیک و ورزش‌های الکترونیک)، مسابقه مهارتی و کاملاً قانونی هستند.
            </p>
          </div>

          {/* Principle 1 */}
          <div className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 block text-[11px]">۱. حذف ۱۰۰٪ شانس (Zero RNG):</strong>
              <span className="text-[10px] text-slate-400">
                چینش، زمان‌بندی و شرایط چالش برای تمام شرکت‌کنندگان تورنمنت برابر و ثابت است.
              </span>
            </div>
          </div>

          {/* Principle 2 */}
          <div className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 block text-[11px]">۲. فرصت برابر با ورود رایگان (تبلیغات):</strong>
              <span className="text-[10px] text-slate-400">
                هر کاربر می‌تواند با مشاهده ویدیوی اسپانسر بلیت رایگان دریافت کرده و بدون پرداخت وجه، در مسابقات جایزه‌دار رقابت کند.
              </span>
            </div>
          </div>

          {/* Principle 3 */}
          <div className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 block text-[11px]">۳. شفافیت استخر جوایز و تسویه آنی:</strong>
              <span className="text-[10px] text-slate-400">
                مبالغ ورودی مستقیماً در استخر جایزه همان چالش قرار می‌گیرد و به برندگان رتبه‌بندی شده پرداخت می‌شود.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
          >
            متوجه شدم و قبول دارم
          </button>
        </div>
      </div>
    </div>
  );
};
