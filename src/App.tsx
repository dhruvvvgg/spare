import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Screen1Ask } from './components/Screen1Ask';
import { Screen2Inventory } from './components/Screen2Inventory';
import { Screen3ThreeMoves } from './components/Screen3ThreeMoves';
import { Screen4LastMile } from './components/Screen4LastMile';
import { ConfettiEffect } from './components/ConfettiEffect';
import { UserInventory, Opportunity } from './types';
import { mergeAndRankOpportunities } from './data/curatedOpportunities';
import { Sun, Heart, Sparkles, HandHeart } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<1 | 2 | 3 | 4>(1);
  const [userInput, setUserInput] = useState<string>('');
  const [location, setLocation] = useState<string>('unknown');
  const [inventory, setInventory] = useState<UserInventory | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [activeMove, setActiveMove] = useState<Opportunity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confettiActive, setConfettiActive] = useState<boolean>(false);

  // Handle Extraction (Call 1) and kick off matching (Call 2 + Tier 2/3)
  const handleExtractAndMatch = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    const effectiveLocation = location && location.trim() !== '' ? location.trim() : 'unknown';
    console.log('[DEBUG client match] Calling /api/match with location:', effectiveLocation);

    try {
      // 1. Extraction Call
      const extractRes = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userInput }),
      });

      if (!extractRes.ok) {
        throw new Error('Could not connect to the extraction service. Please check your internet or retry.');
      }

      const extractData = await extractRes.json();
      const extractedInventory: UserInventory = extractData.inventory;

      if (!extractedInventory) {
        throw new Error("We couldn't unpack what was entered. Let's try rephrasing!");
      }

      setInventory(extractedInventory);

      // Transition to Screen 2 (Inventory Reveal) immediately for emotional beat
      setCurrentScreen(2);
      setIsLoading(false);

      // 2. Concurrently fetch Tier 1 Search-grounded matches
      fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inventory: extractedInventory,
          location: effectiveLocation,
        }),
      })
        .then((res) => res.json())
        .then((matchData) => {
          const tier1Results: Opportunity[] = matchData.tier1Results || [];
          console.log('[DEBUG client rank] Running mergeAndRankOpportunities with location:', effectiveLocation, 'Tier 1 count:', tier1Results.length);
          const ranked = mergeAndRankOpportunities(
            tier1Results,
            extractedInventory,
            effectiveLocation
          );
          setOpportunities(ranked);
          setActiveMove(ranked[0]);
        })
        .catch((err) => {
          console.warn('Tier 1 matching error, using curated fallback:', err);
          // Pure local fallback (Tier 2 + 3) works with zero network access
          console.log('[DEBUG client rank fallback] Running mergeAndRankOpportunities with location:', effectiveLocation);
          const ranked = mergeAndRankOpportunities(
            [],
            extractedInventory,
            effectiveLocation
          );
          setOpportunities(ranked);
          setActiveMove(ranked[0]);
        });
    } catch (err: any) {
      console.warn('Extraction request note:', err);
      setIsLoading(false);
      setErrorMessage(
        err?.message || "Hmm, we couldn't parse that. Your words are still saved in the box — try clicking again!"
      );
      setCurrentScreen(1);
    }
  };

  const handleAdvanceToMoves = useCallback(() => {
    const effectiveLocation = location && location.trim() !== '' ? location.trim() : 'unknown';
    // If opportunities haven't resolved yet, compute instant curated fallback
    if (opportunities.length === 0 && inventory) {
      console.log('[DEBUG client advance] Instant fallback merge with location:', effectiveLocation);
      const fallback = mergeAndRankOpportunities([], inventory, effectiveLocation);
      setOpportunities(fallback);
      setActiveMove(fallback[0]);
    }
    setCurrentScreen(3);
  }, [location, opportunities.length, inventory]);

  const handleSelectMove = (opp: Opportunity) => {
    setActiveMove(opp);
    setCurrentScreen(4);
  };

  const handleStartOver = () => {
    setCurrentScreen(1);
    setOpportunities([]);
    setActiveMove(null);
    setInventory(null);
    setErrorMessage(null);
  };

  const handleTriggerConfetti = () => {
    setConfettiActive(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFDAB9] via-[#FFFACD] to-[#E0F2F7] text-stone-800 flex flex-col justify-between selection:bg-orange-200">
      {/* Confetti canvas overlay */}
      <ConfettiEffect
        active={confettiActive}
        onComplete={() => setConfettiActive(false)}
      />

      {/* Top Warm Cultural Header Bar */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between gap-4">
        <div
          onClick={handleStartOver}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform text-orange-600">
            <HandHeart className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900 font-['Outfit'] leading-none">
              Spare
            </h1>
            <div className="text-[11px] font-semibold text-stone-500 tracking-wide mt-0.5">
              Generosity on your own terms
            </div>
          </div>
        </div>

        {/* Dynamic Inventory Summary in Header (Organic Theme Feature) */}
        {inventory && (
          <div className="hidden md:flex bg-white/60 backdrop-blur-md px-5 py-2 rounded-full border border-white/50 shadow-sm items-center gap-3 text-sm font-medium">
            <span className="text-stone-400 text-xs">Your Inventory:</span>
            {inventory.money && inventory.money.amount > 0 && (
              <span className="bg-orange-100 text-orange-700 font-semibold px-2.5 py-0.5 rounded-lg text-xs">
                {inventory.money.currency === 'INR' ? '₹' : '$'}{inventory.money.amount.toLocaleString()}
              </span>
            )}
            {inventory.time && inventory.time.hours > 0 && (
              <>
                {inventory.money && inventory.money.amount > 0 && <span className="text-stone-300">•</span>}
                <span className="bg-blue-100 text-blue-700 font-semibold px-2.5 py-0.5 rounded-lg text-xs">
                  {inventory.time.hours} hrs
                </span>
              </>
            )}
            {inventory.languages && inventory.languages.length > 0 && (
              <>
                <span className="text-stone-300">•</span>
                <span className="bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-lg text-xs">
                  {inventory.languages[0]}
                </span>
              </>
            )}
            {inventory.objects && inventory.objects.length > 0 && (
              <>
                <span className="text-stone-300">•</span>
                <span className="bg-amber-100 text-amber-800 font-semibold px-2.5 py-0.5 rounded-lg text-xs">
                  {inventory.objects[0].item.split(' ')[0]}
                </span>
              </>
            )}
          </div>
        )}

        {/* Stepper with pill indicator from design */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white/50 backdrop-blur-xs px-3 py-2 rounded-full border border-white/60 shadow-2xs">
            <div
              className={`transition-all duration-300 ${
                currentScreen === 1 ? 'w-6 h-2 rounded-full bg-orange-400' : 'w-2 h-2 rounded-full bg-stone-300'
              }`}
            />
            <div
              className={`transition-all duration-300 ${
                currentScreen === 2 ? 'w-6 h-2 rounded-full bg-orange-400' : 'w-2 h-2 rounded-full bg-stone-300'
              }`}
            />
            <div
              className={`transition-all duration-300 ${
                currentScreen === 3 ? 'w-6 h-2 rounded-full bg-orange-400' : 'w-2 h-2 rounded-full bg-stone-300'
              }`}
            />
            <div
              className={`transition-all duration-300 ${
                currentScreen === 4 ? 'w-6 h-2 rounded-full bg-orange-400' : 'w-2 h-2 rounded-full bg-stone-300'
              }`}
            />
          </div>
          <span className="hidden sm:inline text-xs text-stone-500 font-medium">
            Step {currentScreen}/4
          </span>
        </div>
      </header>

      {/* Main Content Area with Animated Screen Transitions */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {currentScreen === 1 && (
            <Screen1Ask
              key="screen-1"
              userInput={userInput}
              setUserInput={setUserInput}
              location={location}
              setLocation={setLocation}
              onSubmit={handleExtractAndMatch}
              isLoading={isLoading}
              errorMessage={errorMessage}
              onClearError={() => setErrorMessage(null)}
            />
          )}

          {currentScreen === 2 && inventory && (
            <Screen2Inventory
              key="screen-2"
              inventory={inventory}
              onAdvance={handleAdvanceToMoves}
              onBack={() => setCurrentScreen(1)}
            />
          )}

          {currentScreen === 3 && (
            <Screen3ThreeMoves
              key="screen-3"
              opportunities={opportunities}
              location={location}
              onSelectMove={handleSelectMove}
              onBackToInventory={() => setCurrentScreen(2)}
              onBackToStart={handleStartOver}
            />
          )}

          {currentScreen === 4 && activeMove && inventory && (
            <Screen4LastMile
              key="screen-4"
              opportunities={opportunities}
              activeMove={activeMove}
              setActiveMove={setActiveMove}
              inventory={inventory}
              userInput={userInput}
              location={location}
              onBackToMoves={() => setCurrentScreen(3)}
              onStartOver={handleStartOver}
              onTriggerConfetti={handleTriggerConfetti}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Warm Organic Cultural Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 mt-4 flex flex-col sm:flex-row justify-between items-center border-t border-orange-200/40 pt-6 gap-4 text-stone-500">
        <div className="flex items-center gap-6 sm:gap-8">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
            International Day of Charity
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
          {currentScreen > 1 && (
            <>
              <p className="text-xs sm:text-sm text-stone-500 italic hidden md:inline">
                Not what you were looking for?
              </p>
              <button
                type="button"
                onClick={() => setCurrentScreen(2)}
                className="px-5 py-2 rounded-full border-2 border-stone-800 text-stone-800 font-bold text-xs sm:text-sm hover:bg-stone-800 hover:text-white transition-all cursor-pointer"
              >
                Update Inventory
              </button>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
