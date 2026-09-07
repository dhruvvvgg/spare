import React from 'react';
import { motion } from 'motion/react';
import { Opportunity } from '../types';
import {
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  MapPin,
  Sparkles,
  CheckCircle2,
  Utensils,
  GraduationCap,
  Eye,
  Leaf,
  Laptop,
  Heart,
  Coins,
} from 'lucide-react';

interface Screen3ThreeMovesProps {
  opportunities: Opportunity[];
  location?: string;
  onSelectMove: (opportunity: Opportunity) => void;
  onBackToInventory: () => void;
  onBackToStart: () => void;
}

const getOpportunityIcon = (name: string, action: string, idx: number): React.ReactNode => {
  const combined = (name + ' ' + action).toLowerCase();
  if (combined.includes('food') || combined.includes('meal') || combined.includes('rice') || combined.includes('hunger')) return <Utensils className="w-6 h-6 text-orange-600" />;
  if (combined.includes('lang') || combined.includes('teach') || combined.includes('homework') || combined.includes('learn') || combined.includes('hindi') || combined.includes('spanish')) return <GraduationCap className="w-6 h-6 text-blue-600" />;
  if (combined.includes('see') || combined.includes('eye') || combined.includes('blind') || combined.includes('vision')) return <Eye className="w-6 h-6 text-indigo-600" />;
  if (combined.includes('nature') || combined.includes('tree') || combined.includes('garden') || combined.includes('climate') || combined.includes('park')) return <Leaf className="w-6 h-6 text-emerald-600" />;
  if (combined.includes('code') || combined.includes('laptop') || combined.includes('map') || combined.includes('tech')) return <Laptop className="w-6 h-6 text-stone-700" />;
  if (combined.includes('crisis') || combined.includes('listen') || combined.includes('care') || combined.includes('heart')) return <Heart className="w-6 h-6 text-rose-600" />;
  if (combined.includes('give') || combined.includes('cash') || combined.includes('money')) return <Coins className="w-6 h-6 text-amber-600" />;
  return idx === 0 ? <Utensils className="w-6 h-6 text-orange-600" /> : idx === 1 ? <GraduationCap className="w-6 h-6 text-blue-600" /> : <Leaf className="w-6 h-6 text-emerald-600" />;
};

export const Screen3ThreeMoves: React.FC<Screen3ThreeMovesProps> = ({
  opportunities,
  location = 'unknown',
  onSelectMove,
  onBackToInventory,
  onBackToStart,
}) => {
  const effectiveLocation = location && location.trim() !== '' ? location.trim() : 'unknown';
  const isUnknownLocation = effectiveLocation.toLowerCase() === 'unknown' || effectiveLocation.toLowerCase() === 'worldwide';

  return (
    <motion.div
      id="screen-three-moves"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-6xl mx-auto"
    >
      {/* Top Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <button
          type="button"
          onClick={onBackToInventory}
          className="inline-flex items-center gap-1.5 text-stone-600 hover:text-stone-900 text-sm font-semibold transition-colors cursor-pointer py-1.5 px-3.5 rounded-full bg-white/50 border border-white/60 hover:bg-white/80 shadow-2xs self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to inventory</span>
        </button>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="inline-flex items-center gap-1.5 text-xs text-stone-600 bg-white/60 px-3 py-1 rounded-full border border-stone-200/60 shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            <span>Matched for:</span>
            <strong className="text-stone-800">{isUnknownLocation ? 'Worldwide / Anywhere' : effectiveLocation}</strong>
          </div>

          <button
            type="button"
            onClick={onBackToStart}
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 font-medium py-1 px-3 rounded-full hover:bg-white/40 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Start new search</span>
          </button>
        </div>
      </div>

      {/* Warm Cultural Header */}
      <div className="mb-8 animate-in slide-in-from-bottom-4 duration-700">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-2 font-['Outfit']">
          Look what you can do.
        </h2>
        <p className="text-lg sm:text-xl text-stone-600 max-w-2xl leading-relaxed">
          We found three delightful ways to put your spare resources to work this week. No pressure, just possibilities.
        </p>
      </div>

      {/* 3 Opportunity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-stretch">
        {opportunities.map((opp, idx) => {
          const isTier1 = opp.verificationTier === 'tier1' || (!opp.verificationTier && idx === 0);
          const isTier2 = opp.verificationTier === 'tier2' || (!opp.verificationTier && idx === 1);
          const isTier3 = opp.verificationTier === 'tier3' || (!opp.verificationTier && idx === 2);

          const oppIcon = getOpportunityIcon(opp.name, opp.action, idx);

          // Tier badge styles from design
          let badgeClass = 'bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200/80';
          let badgeText = '✓ Verified Live';
          let squircleBg = 'bg-orange-100';
          let cardBg = 'bg-white/90 rounded-[32px] p-7 shadow-xl shadow-orange-900/5 border border-white flex flex-col justify-between relative group hover:shadow-2xl transition-shadow';
          let calloutBg = 'bg-[#FFF9F0] p-4 rounded-2xl border border-orange-50 mb-4';
          let calloutTextColor = 'text-xs text-orange-800 leading-relaxed italic';
          let btnClass = 'w-full py-4 bg-orange-400 hover:bg-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-200/50 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95';

          if (isTier2) {
            badgeClass = 'bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200/80';
            badgeText = '✓ Hand-Checked';
            squircleBg = 'bg-blue-100';
            cardBg = 'bg-white/90 rounded-[32px] p-7 shadow-xl shadow-orange-900/5 border border-white flex flex-col justify-between relative group hover:shadow-2xl transition-shadow';
            calloutBg = 'bg-[#F0F7FF] p-4 rounded-2xl border border-blue-50 mb-4';
            calloutTextColor = 'text-xs text-blue-800 leading-relaxed italic';
            btnClass = 'w-full py-4 bg-blue-400 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95';
          } else if (isTier3 && !isTier1) {
            badgeClass = 'bg-stone-50 text-stone-700 text-xs font-bold px-3 py-1 rounded-full border border-stone-200/80';
            badgeText = '🔍 Search Live';
            squircleBg = 'bg-stone-100';
            cardBg = 'bg-white/40 rounded-[32px] p-7 shadow-sm border border-white/50 border-dashed flex flex-col justify-between relative hover:bg-white/60 transition-colors';
            calloutBg = 'bg-white/40 p-4 rounded-2xl border border-white mb-4';
            calloutTextColor = 'text-xs text-stone-500 leading-relaxed italic';
            btnClass = 'w-full py-4 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-2xl shadow-lg shadow-stone-800/10 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95';
          }

          return (
            <motion.div
              key={opp.id || `opp-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.12 }}
              className={cardBg}
            >
              <div>
                {/* Top Row: Category Squircle + Zero Signup Tag */}
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 ${squircleBg} rounded-2xl flex items-center justify-center shadow-xs`}>
                    {oppIcon}
                  </div>
                  {opp.isZeroCostAndZeroSignup && (
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border border-emerald-200/70">
                      Zero Cost • No Signup
                    </span>
                  )}
                </div>

                {/* Opportunity Title */}
                <h3 className="text-2xl font-bold text-stone-900 mb-1.5 font-['Outfit'] leading-tight">
                  {opp.name}
                </h3>

                {/* Verification Badge prominently right under the card title */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {opp.source_url ? (
                    <a
                      href={opp.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-2xs ${badgeClass} hover:opacity-90`}
                      title={`Open verified site: ${opp.source_url}`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{opp.badgeLabel || badgeText}</span>
                      <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                    </a>
                  ) : (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${badgeClass}`}>
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{opp.badgeLabel || badgeText}</span>
                    </span>
                  )}

                  {/* Physical / In-person badge */}
                  {opp.is_physical && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 text-xs font-bold">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>In-person / Local</span>
                    </span>
                  )}
                </div>

                {/* Tier 1 Live Search Grounding Attribution line */}
                {isTier1 && (
                  <div className="text-[11px] text-emerald-800 bg-emerald-50/80 border border-emerald-200/70 rounded-xl px-3 py-1.5 mb-3 flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Found via live search for {opp.name}</span>
                  </div>
                )}

                {/* Physical note: prominent 1-line note */}
                {opp.is_physical && (
                  <div className="text-[11px] text-amber-900 bg-amber-50/80 border border-amber-200/80 rounded-xl px-3 py-1.5 mb-3 flex items-start gap-1.5 leading-snug">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      {opp.physicalNote ||
                        (isUnknownLocation
                          ? 'Physical drop-off (multiple cities — check if one is near you)'
                          : `Drop off or volunteer in person — check nearest centre at ${opp.name}`)}
                    </span>
                  </div>
                )}

                {/* One-liner */}
                <p className="text-stone-500 text-sm leading-relaxed mb-5">
                  {opp.one_liner}
                </p>

                {/* Metadata Pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-stone-50 text-stone-600 text-[11px] font-semibold px-3 py-1 rounded-full border border-stone-100">
                    {opp.cost.toLowerCase().includes('zero') || opp.cost.toLowerCase().includes('free') ? 'Free' : opp.cost}
                  </span>
                  <span className="bg-stone-50 text-stone-600 text-[11px] font-semibold px-3 py-1 rounded-full border border-stone-100">
                    {opp.time_required}
                  </span>
                  <span className="bg-stone-50 text-stone-600 text-[11px] font-semibold px-3 py-1 rounded-full border border-stone-100">
                    {opp.effort}
                  </span>
                </div>
              </div>

              {/* Bottom: Why it fits quote + Action button */}
              <div className="mt-auto pt-2">
                <div className={calloutBg}>
                  <p className={calloutTextColor}>
                    "{opp.why_it_fits}"
                  </p>
                </div>

                <button
                  id={`draft-message-btn-${idx}`}
                  type="button"
                  onClick={() => onSelectMove(opp)}
                  className={btnClass}
                >
                  <span>Draft my message</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="mt-3 flex items-center justify-center gap-2.5 flex-wrap">
                  <a
                    href={opp.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-stone-400 hover:text-stone-700 font-medium underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    <span>Visit {opp.name} site</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {opp.is_physical && (
                    <>
                      <span className="text-stone-300 text-xs select-none">•</span>
                      <a
                        id={`get-directions-btn-${idx}`}
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          !isUnknownLocation && effectiveLocation ? `${opp.name} ${effectiveLocation}` : opp.name
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-orange-600 hover:text-orange-700 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                        title={`Open Google Maps directions for ${opp.name}`}
                      >
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>Get Directions</span>
                      </a>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
