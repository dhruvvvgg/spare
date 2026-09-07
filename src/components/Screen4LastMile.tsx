import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Opportunity, UserInventory } from '../types';
import { ShareCard } from './ShareCard';
import {
  Copy,
  Check,
  Mail,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Send,
  Heart,
  Edit3,
  MapPin,
} from 'lucide-react';

interface Screen4LastMileProps {
  opportunities: Opportunity[];
  activeMove: Opportunity;
  setActiveMove: (opp: Opportunity) => void;
  inventory: UserInventory;
  userInput: string;
  location?: string;
  onBackToMoves: () => void;
  onStartOver: () => void;
  onTriggerConfetti: () => void;
}

export const Screen4LastMile: React.FC<Screen4LastMileProps> = ({
  opportunities,
  activeMove,
  setActiveMove,
  inventory,
  userInput,
  location,
  onBackToMoves,
  onStartOver,
  onTriggerConfetti,
}) => {
  // Store drafted messages by opportunity ID
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loadingDraft, setLoadingDraft] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Fetch or generate draft for the current active move
  useEffect(() => {
    if (drafts[activeMove.id]) return;

    let isMounted = true;
    setLoadingDraft(true);

    const fetchDraft = async () => {
      try {
        const res = await fetch('/api/draft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            originalText: userInput,
            opportunityName: activeMove.name,
            action: activeMove.action,
            userName: 'A neighbor',
          }),
        });
        const data = await res.json();
        if (isMounted && data.message) {
          setDrafts((prev) => ({ ...prev, [activeMove.id]: data.message }));
        }
      } catch (err) {
        console.warn('Draft notice: using warm default template.');
        if (isMounted) {
          const fallbackMsg = `Hi ${activeMove.name} team,\n\nI was looking at what I have spare right now and would love to help out with ${activeMove.action}. I have some capacity this week and wanted to see the best way to get started.\n\nWarmly,\nA neighbor`;
          setDrafts((prev) => ({ ...prev, [activeMove.id]: fallbackMsg }));
        }
      } finally {
        if (isMounted) setLoadingDraft(false);
      }
    };

    fetchDraft();

    return () => {
      isMounted = false;
    };
  }, [activeMove.id, activeMove.name, activeMove.action, userInput]);

  const currentMessage = drafts[activeMove.id] || '';

  const handleTextChange = (newText: string) => {
    setDrafts((prev) => ({ ...prev, [activeMove.id]: newText }));
  };

  const handleCopy = async () => {
    if (!currentMessage) return;
    try {
      await navigator.clipboard.writeText(currentMessage);
      setCopied(true);
      onTriggerConfetti(); // Celebratory confetti burst!
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Clipboard write error:', err);
    }
  };

  const handleMailTo = () => {
    const subject = encodeURIComponent(`Quick note regarding ${activeMove.name}`);
    const body = encodeURIComponent(currentMessage);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <motion.div
      id="screen-last-mile"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Navigation Top */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onBackToMoves}
          className="inline-flex items-center gap-1.5 text-stone-600 hover:text-stone-900 text-sm font-semibold transition-colors cursor-pointer py-1.5 px-3.5 rounded-full bg-white/50 border border-white/60 hover:bg-white/80 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to 3 moves</span>
        </button>

        <button
          type="button"
          onClick={onStartOver}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 font-medium py-1 px-3 rounded-full hover:bg-white/40 cursor-pointer transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Start fresh</span>
        </button>
      </div>

      {/* Move Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-full bg-white/50 backdrop-blur-xs border border-white/60 mb-6 overflow-x-auto shadow-2xs">
        {opportunities.map((opp, idx) => {
          const isActive = opp.id === activeMove.id;
          return (
            <button
              key={opp.id}
              type="button"
              onClick={() => setActiveMove(opp)}
              className={`flex-1 min-w-[140px] px-4 py-2 rounded-full text-xs font-bold transition-all truncate cursor-pointer text-center ${
                isActive
                  ? 'bg-white text-stone-900 shadow-sm border border-orange-200'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-white/40'
              }`}
            >
              <span>Move #{idx + 1}: {opp.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Draft Card */}
      <div className="bg-white/90 rounded-[32px] p-7 sm:p-9 shadow-xl shadow-orange-900/5 border border-white relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-stone-100">
          <div>
            <div className="text-xs font-bold text-orange-700 uppercase tracking-wide flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Step 4 • Ready-to-Send Outreach</span>
            </div>
            <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-stone-900">
              Draft for {activeMove.name}
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={activeMove.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-orange-800 font-semibold px-3.5 py-1.5 rounded-full bg-stone-50 hover:bg-stone-100 border border-stone-200/60 transition-colors"
            >
              <span>Visit site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {activeMove.is_physical && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  location && location !== 'unknown' && location !== 'Worldwide'
                    ? `${activeMove.name} ${location}`
                    : activeMove.name
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-orange-700 hover:text-orange-900 font-semibold px-3.5 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 border border-orange-200/80 transition-colors cursor-pointer"
                title={`Open Google Maps directions for ${activeMove.name}`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </a>
            )}
          </div>
        </div>

        <div className="text-xs text-stone-500 mb-3 flex items-center justify-between">
          <span>Written casually in your authentic voice (under 80 words). Feel free to edit:</span>
          <span className="font-medium flex items-center gap-1 text-stone-400">
            <Edit3 className="w-3 h-3" /> Editable
          </span>
        </div>

        {/* Editable Draft Text Area */}
        <div className="relative">
          {loadingDraft ? (
            <div className="w-full h-40 rounded-2xl bg-orange-50/40 border border-orange-200/60 flex flex-col items-center justify-center gap-2 text-stone-500 text-sm">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <span>Crafting a friendly, human note in your voice...</span>
            </div>
          ) : (
            <textarea
              id="drafted-message-textarea"
              rows={5}
              value={currentMessage}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full rounded-2xl p-5 text-stone-800 text-base bg-[#FFFDF9] border border-orange-200/60 focus:border-orange-400 focus:outline-hidden focus:ring-4 focus:ring-orange-200/40 transition-all leading-relaxed shadow-inner resize-none font-['Plus_Jakarta_Sans',sans-serif]"
            />
          )}
        </div>

        {/* Actions Row */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-stone-500">
            Tap to copy or open in your email client.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="copy-draft-message-btn"
              type="button"
              onClick={handleCopy}
              disabled={loadingDraft || !currentMessage}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-orange-400 hover:bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-200/50 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Copied to clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy message</span>
                </>
              )}
            </button>

            <button
              id="send-email-mailto-btn"
              type="button"
              onClick={handleMailTo}
              disabled={loadingDraft || !currentMessage}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-sm shadow-lg shadow-stone-800/10 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Mail className="w-4 h-4 text-orange-400" />
              <span>Email this</span>
            </button>
          </div>
        </div>
      </div>

      {/* Shareable Card Generator (Below all three as requested) */}
      <ShareCard
        inventory={inventory}
        topMatch={activeMove}
        onSparkle={onTriggerConfetti}
      />

      {/* Bottom Start Over Button */}
      <div className="mt-10 text-center">
        <button
          type="button"
          onClick={onStartOver}
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 text-sm font-semibold underline underline-offset-4 cursor-pointer transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>I have other spare gifts to match</span>
        </button>
      </div>
    </motion.div>
  );
};
