import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Award, ArrowRight, Zap, Target as TargetIcon, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Tournament, Target, FloatingScore } from '../types';
import { sound } from '../utils/audio';

interface GameArenaProps {
  tournament: Tournament | null;
  onFinishGame: (finalScore: number, accuracy: number, maxCombo: number) => void;
  onExit: () => void;
}

export const GameArena: React.FC<GameArenaProps> = ({
  tournament,
  onFinishGame,
  onExit,
}) => {
  const [gameState, setGameState] = useState<'intro' | 'countdown' | 'playing' | 'gameover'>('intro');
  const [countdown, setCountdown] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(1);
  const [maxCombo, setMaxCombo] = useState<number>(1);
  const [hits, setHits] = useState<number>(0);
  const [misses, setMisses] = useState<number>(0);
  const [targets, setTargets] = useState<Target[]>([]);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);

  const arenaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<number | null>(null);
  const idCounter = useRef<number>(0);

  // Sound & Vibrate helper
  const addFloatingScore = (x: number, y: number, text: string, color: string, currentCombo?: number) => {
    const id = `f-${Date.now()}-${Math.random()}`;
    setFloatingScores((prev) => [...prev.slice(-6), { id, x, y, text, color, combo: currentCombo }]);
    setTimeout(() => {
      setFloatingScores((prev) => prev.filter((item) => item.id !== id));
    }, 750);
  };

  // Start the 3-2-1 countdown
  const startCountdown = () => {
    setGameState('countdown');
    setCountdown(3);
    setScore(0);
    setCombo(1);
    setMaxCombo(1);
    setHits(0);
    setMisses(0);
    setTimeLeft(30);
    setTargets([]);
    setFloatingScores([]);

    sound.playCountdown(false);
    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        sound.playCountdown(false);
      } else if (count === 0) {
        setCountdown(0);
        sound.playCountdown(true);
      } else {
        clearInterval(interval);
        setGameState('playing');
      }
    }, 900);
  };

  // Target spawner logic
  const spawnTarget = useCallback(() => {
    idCounter.current += 1;
    const id = `target-${idCounter.current}-${Date.now()}`;

    // Deterministic distribution of target types
    const rand = Math.random();
    let type: Target['type'] = 'regular';
    let durationMs = 2100;
    let points = 100;
    let size = 64; // px

    if (rand < 0.15) {
      type = 'gold';
      points = 250;
      durationMs = 1700;
      size = 68;
    } else if (rand < 0.23) {
      type = 'freeze';
      points = 150;
      durationMs = 1900;
      size = 60;
    } else if (rand < 0.40) {
      type = 'hazard';
      points = -150;
      durationMs = 2400;
      size = 62;
    }

    // Keep targets comfortably within mobile screen bounds (12% to 84%)
    const x = Math.floor(Math.random() * 70) + 14;
    const y = Math.floor(Math.random() * 64) + 16;

    const newTarget: Target = {
      id,
      x,
      y,
      type,
      points,
      durationMs,
      createdAt: Date.now(),
      size,
    };

    setTargets((prev) => [...prev.slice(-4), newTarget]);
  }, []);

  // Main game tick & timer
  useEffect(() => {
    if (gameState === 'playing') {
      // 1. Clock countdown timer
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            clearInterval(spawnTimerRef.current!);
            setGameState('gameover');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // 2. Continuous target spawning
      spawnTarget();
      spawnTimerRef.current = window.setInterval(() => {
        spawnTarget();
      }, 700);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      };
    }
  }, [gameState, spawnTarget]);

  // Handle Game Over
  useEffect(() => {
    if (gameState === 'gameover') {
      sound.playCash();
      const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;
      
      // Fire victory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      onFinishGame(score, accuracy, maxCombo);
    }
  }, [gameState, hits, misses, maxCombo, onFinishGame, score]);

  // Target Tap Handler
  const handleTargetClick = (target: Target, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();

    // Remove tapped target immediately
    setTargets((prev) => prev.filter((t) => t.id !== target.id));

    if (target.type === 'hazard') {
      // Hit a penalty hazard!
      sound.playHazardTap();
      setCombo(1);
      setMisses((prev) => prev + 1);
      setScore((prev) => Math.max(0, prev - 150));
      addFloatingScore(target.x, target.y, '-۱۵۰ خطا', 'text-rose-500');
    } else {
      // Successful skill tap!
      setHits((prev) => prev + 1);
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((prev) => Math.max(prev, newCombo));

      const earnedPoints = target.points * Math.min(newCombo, 5);
      setScore((prev) => prev + earnedPoints);

      if (target.type === 'gold') {
        sound.playGoldTap();
        addFloatingScore(target.x, target.y, `+${earnedPoints} طلایی!`, 'text-amber-400', newCombo);
      } else if (target.type === 'freeze') {
        sound.playFreezeTap();
        setTimeLeft((prev) => Math.min(45, prev + 2));
        addFloatingScore(target.x, target.y, '+۲ ثانیه زمان!', 'text-cyan-400', newCombo);
      } else {
        sound.playTap(newCombo);
        addFloatingScore(
          target.x,
          target.y,
          `+${earnedPoints}${newCombo > 2 ? ` (x${Math.min(newCombo, 5)})` : ''}`,
          'text-sky-400',
          newCombo
        );
      }
    }
  };

  // Background Arena Miss Tap Handler
  const handleArenaBackgroundClick = () => {
    if (gameState !== 'playing') return;
    setMisses((prev) => prev + 1);
    if (combo > 1) {
      setCombo(1);
      sound.playHazardTap();
    }
  };

  const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 100;

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[520px] max-h-[720px] flex flex-col bg-gradient-to-b from-[#0d1424] via-[#090d16] to-[#04060a] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden select-none">
      {/* Top HUD: Score, Timer & Combo Multiplier */}
      <div className="flex items-center justify-between p-3 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 z-20">
        {/* Score Display */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">امتیاز مهارتی</span>
            <span className="text-lg font-black text-slate-100 font-mono tracking-wider">
              {score.toLocaleString('fa-IR')}
            </span>
          </div>
        </div>

        {/* Combo Multiplier Pill */}
        <div
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black transition-all ${
            combo >= 4
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-105'
              : combo >= 2
              ? 'bg-sky-500/30 text-sky-300 border border-sky-400/40'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>ضریب {Math.min(combo, 5)}x</span>
        </div>

        {/* Timer Display */}
        <div className="flex items-center gap-2">
          <div className="text-left">
            <span className="text-[10px] text-slate-400 block font-medium">زمان باقیمانده</span>
            <span
              className={`text-lg font-black font-mono ${
                timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
              }`}
            >
              {timeLeft.toString().padStart(2, '۰')}s
            </span>
          </div>
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              timeLeft <= 5 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}
          >
            <Clock className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Dynamic Progress Bar for remaining time */}
      <div className="w-full h-1 bg-slate-950">
        <div
          className={`h-full transition-all duration-300 ${
            timeLeft <= 5 ? 'bg-rose-500' : 'bg-gradient-to-r from-sky-400 to-emerald-400'
          }`}
          style={{ width: `${(timeLeft / 30) * 100}%` }}
        ></div>
      </div>

      {/* Main Touch Arena Canvas */}
      <div
        ref={arenaRef}
        onClick={handleArenaBackgroundClick}
        className="relative flex-1 w-full touch-none overflow-hidden cursor-crosshair"
      >
        {/* Ambient Grid for futuristic arena feeling */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none"></div>

        {/* Floating Scores */}
        {floatingScores.map((item) => (
          <div
            key={item.id}
            className={`absolute font-black text-sm pointer-events-none transition-all duration-700 animate-bounce ${item.color}`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: 'translate(-50%, -100%)',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            }}
          >
            {item.text}
          </div>
        ))}

        {/* Active Targets */}
        {gameState === 'playing' &&
          targets.map((target) => (
            <button
              key={target.id}
              onClick={(e) => handleTargetClick(target, e)}
              onTouchStart={(e) => handleTargetClick(target, e)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition active:scale-90 touch-manipulation flex items-center justify-center"
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                width: `${target.size}px`,
                height: `${target.size}px`,
              }}
            >
              {/* Target Styling based on type */}
              {target.type === 'regular' && (
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-sky-600 to-cyan-400 shadow-lg shadow-cyan-500/50 flex items-center justify-center text-white border-2 border-cyan-200 animate-pulse">
                  <TargetIcon className="w-7 h-7" />
                </div>
              )}

              {target.type === 'gold' && (
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 shadow-xl shadow-amber-400/60 flex items-center justify-center text-slate-950 font-black border-2 border-white animate-spin-slow">
                  <div className="flex flex-col items-center leading-none">
                    <Zap className="w-5 h-5 text-slate-950 fill-current" />
                    <span className="text-[10px] font-black">+۲۵۰</span>
                  </div>
                </div>
              )}

              {target.type === 'freeze' && (
                <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-300 shadow-lg shadow-teal-400/50 flex items-center justify-center text-slate-950 font-black border-2 border-white">
                  <div className="flex flex-col items-center leading-none">
                    <span className="text-lg">❄️</span>
                    <span className="text-[9px] font-black text-slate-900">+۲ث</span>
                  </div>
                </div>
              )}

              {target.type === 'hazard' && (
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-rose-700 to-red-500 shadow-lg shadow-rose-600/60 flex items-center justify-center text-white border-2 border-rose-300 animate-ping-slow">
                  <AlertTriangle className="w-6 h-6 text-yellow-300" />
                </div>
              )}
            </button>
          ))}

        {/* 1. INTRO / START OVERLAY */}
        {gameState === 'intro' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-slate-950/85 backdrop-blur-md text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-3xl shadow-xl shadow-sky-500/20 mb-4 border border-sky-400/30">
              ⚡
            </div>
            <h2 className="text-xl font-black text-slate-100 mb-2">
              {tournament ? tournament.title : 'چالش مهارت و واکنش لمسی'}
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mb-4 leading-relaxed">
              در مدت ۳۰ ثانیه، سریعاً روی اهداف آبی و طلایی ضربه بزنید. از اهداف هشدار قرمز دوری کنید!
            </p>

            {/* Target Legend Chips */}
            <div className="grid grid-cols-2 gap-2 w-full max-w-xs mb-5 text-[11px] text-right">
              <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-cyan-400 inline-block shrink-0"></span>
                <span className="text-slate-300">هدف معمولی (+۱۰۰)</span>
              </div>
              <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-400 inline-block shrink-0"></span>
                <span className="text-amber-300">طلایی (+۲۵۰)</span>
              </div>
              <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-teal-400 inline-block shrink-0"></span>
                <span className="text-teal-300">افزایش زمان (+۲ث)</span>
              </div>
              <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-rose-500 inline-block shrink-0"></span>
                <span className="text-rose-400">بمب خطا (-۱۵۰)</span>
              </div>
            </div>

            {/* Fair Play assurance */}
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 mb-5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>رقابت ۱۰۰٪ متکی بر مهارت و سرعت انگشتان</span>
            </div>

            {/* Start Button */}
            <div className="flex items-center gap-2 w-full max-w-xs">
              <button
                id="start-challenge-btn"
                onClick={startCountdown}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-sky-500/30 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>شروع چالش ۳۰ ثانیه‌ای</span>
              </button>
              <button
                id="exit-challenge-btn"
                onClick={onExit}
                className="py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition active:scale-95"
              >
                بازگشت
              </button>
            </div>
          </div>
        )}

        {/* 2. COUNTDOWN OVERLAY */}
        {gameState === 'countdown' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
            <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400 animate-ping">
              {countdown === 0 ? 'شروع!' : countdown}
            </div>
            <p className="text-xs text-slate-400 mt-4">آماده ضربه زدن به اهداف باشید!</p>
          </div>
        )}

        {/* 3. GAME OVER & RESULTS OVERLAY */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-3xl shadow-xl shadow-amber-500/30 mb-2 border border-amber-400/40 animate-bounce">
              🏆
            </div>
            <h3 className="text-xl font-black text-slate-100 mb-1">پایان چالش مهارتی!</h3>
            <p className="text-xs text-slate-400 mb-4">عملکرد شما ثبت و سنجیده شد</p>

            {/* Scoreboard Card */}
            <div className="w-full max-w-xs bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-5 shadow-lg">
              <div className="text-center pb-3 border-b border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-0.5">امتیاز نهایی شما</span>
                <span className="text-3xl font-black text-amber-400 font-mono tracking-tight">
                  {score.toLocaleString('fa-IR')}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 text-center">
                <div className="bg-slate-950/50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">دقت ضربات</span>
                  <span className="text-xs font-bold text-sky-400 font-mono">{accuracy}٪</span>
                </div>
                <div className="bg-slate-950/50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">بیشترین کمبو</span>
                  <span className="text-xs font-bold text-amber-400 font-mono">{maxCombo}x</span>
                </div>
                <div className="bg-slate-950/50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">ضربه / خطا</span>
                  <span className="text-xs font-bold text-slate-200 font-mono">
                    {hits} / {misses}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 w-full max-w-xs">
              <button
                id="retry-game-btn"
                onClick={startCountdown}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>تلاش مجدد برای رکورد بهتر</span>
              </button>
              <button
                id="finish-game-btn"
                onClick={onExit}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>مشاهده رتبه‌بندی در تورنمنت</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
