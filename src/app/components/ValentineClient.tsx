'use client';

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  MESSAGES,
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
      <div className="grow flex flex-col items-center justify-center w-full p-6 text-center animate-in fade-in zoom-in duration-500 overflow-hidden">
        <div className=" flex items-center justify-center min-h-0 w-full">
          <Image
            src={SUCCESS_IMAGE_URL}
            width={400}
            height={400}
            alt="Celebration"
            className="max-w-full max-h-full object-contain rounded-2xl"
            unoptimized={true}
          />
        </div>
        <div className="flex items-start justify-center w-full mt-4">
          <h1 className="text-4xl md:text-6xl font-bold text-[#A30262] drop-shadow-sm shrink-0">
            {SUCCESS_TEXT}
          </h1>
        </div>
      </div>
    );
  }

  const messageIndex = Math.min(noCount, MESSAGES.length - 1);
  const { buttonText: noButtonText, questionText } = MESSAGES[messageIndex];

  return (
    <div className="z-10 flex flex-col items-center justify-center w-full p-6 grow">
      <div className="flex flex-col items-center justify-center min-h-0 w-full shrink">
        <div className="flex items-center justify-center min-h-0 w-full shrink">
          <img
            src={ASKING_IMAGE_URL}
            alt="Cute asking cat"
            className="max-w-full max-h-full min-h-0 object-contain shrink transition-all duration-300"
          />
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-center text-[#A30262] leading-tight shrink-0 my-4">
          {name && noCount === 0 ? `${name}, ` : ''}{questionText}
        </h1>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-center w-full shrink-0 mt-4 min-h-[100px] relative">
        <button
          onClick={handleYesClick}
          style={{
            fontSize: `${noCount * 10 + 20}px`,
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          className="bg-[#2ecc71] hover:bg-[#27ae60] text-white font-bold py-3 px-8 corner-squircle rounded-4xl shadow-lg z-20 whitespace-nowrap duration-200 hover:scale-104"
        >
          Yes 💖
        </button>

        <button
          onClick={handleNoClick}
          className="bg-[#e74c3c] hover:bg-[#c0392b] text-white font-bold py-3 px-8 corner-squircle rounded-4xl shadow-lg text-xl transition-all duration-200 hover:scale-95 shrink-0 pb-4"
        >
          {noButtonText}
        </button>
      </div>
    </div>
  );
}
