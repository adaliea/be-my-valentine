'use client';

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  REJECTION_MESSAGES,
  QUESTION_MESSAGES,
  SUCCESS_IMAGE_URL,
  SUCCESS_TEXT,
  CONFETTI_COLORS,
  ASKING_IMAGE_URL
} from '../constants';
import Image from "next/image";

interface ValentineClientProps {
  name?: string | null;
}

export default function ValentineClient({ name }: ValentineClientProps) {
  const [accepted, setAccepted] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNoClick = async () => {
    const newCount = noCount + 1;
    setNoCount(newCount);
    
    // Record the "No" click
    try {
      await fetch('/api/record', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noCount: newCount, action: 'no' }),
      });
    } catch (e) {
      console.error('Failed to record "No" click');
    }
  };

  const handleYesClick = async () => {
    setAccepted(true);
    confetti({
      particleCount: 150,
      spread: 60,
      origin: { y: 0.6 },
      colors: CONFETTI_COLORS
    });
    
    // Fire a few more bursts for effect
    setTimeout(() => confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 }, colors: CONFETTI_COLORS }), 200);
    setTimeout(() => confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 }, colors: CONFETTI_COLORS }), 400);

    try {
      await fetch('/api/record', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noCount, action: 'yes' }),
      });
    } catch (error) {
      console.error('Failed to record "Yes" click:', error);
    }
  };

  if (!mounted) return null; // Avoid hydration mismatch on initial render with dynamic styles if any

  if (accepted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center animate-in fade-in zoom-in duration-500">
        <Image
          src={SUCCESS_IMAGE_URL}
          width={"400"}
          height={"400"}
          alt="Celebration" 
          className="max-w-full h-auto rounded-lg max-h-[400px] object-contain"
          unoptimized={true}
        />
        <h1 className="text-4xl md:text-6xl font-bold text-[#A30262] drop-shadow-sm">
          {SUCCESS_TEXT}
        </h1>
      </div>
    );
  }

  const noButtonText = REJECTION_MESSAGES[Math.min(noCount, REJECTION_MESSAGES.length - 1)];
  const questionText = QUESTION_MESSAGES[Math.min(noCount, QUESTION_MESSAGES.length - 1)];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden relative">
      <div className="z-10 flex flex-col items-center gap-8 w-full">
        <Image
          src={ASKING_IMAGE_URL}
          width={"500"}
          height={"500"}
          alt="Cute asking cat"
          className="w-48 h-48 object-contain mb-4"
          unoptimized={true}
        />
        
        <h1 className="text-3xl md:text-5xl font-bold text-center text-[#A30262] leading-tight">
          {name && noCount === 0 ? `${name}, ` : ''}{questionText}
        </h1>

        <div className="flex flex-wrap gap-4 items-center justify-center w-full mt-8">
          <button
            onClick={handleYesClick}
            style={{ 
              fontSize: `${noCount * 10 + 20}px`,
              transition: 'width 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) height 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            className="bg-[#2ecc71] hover:bg-[#27ae60] text-white font-bold py-3 px-8 rounded-full shadow-lg text-xl z-20 whitespace-nowrap duration-200 hover:scale-104"
          >
            Yes 💖
          </button>

          <button
            onClick={handleNoClick}
            className="bg-[#e74c3c] hover:bg-[#c0392b] text-white font-bold py-3 px-8 rounded-full shadow-lg text-xl transition-all duration-200 hover:scale-95"
          >
            {noButtonText}
          </button>
        </div>
      </div>
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-6xl text-pink-300 animate-pulse">❤</div>
        <div className="absolute bottom-10 right-10 text-8xl text-purple-300 animate-bounce">❤</div>
        <div className="absolute top-1/2 left-1/4 text-4xl text-orange-300 animate-spin-slow">❤</div>
      </div>
    </div>
  );
}
