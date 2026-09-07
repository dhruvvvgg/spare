import React, { useRef, useState } from 'react';
import { UserInventory, Opportunity } from '../types';
import { Download, Share2, Sparkles, Check, Heart, Sun, HandHeart } from 'lucide-react';

interface ShareCardProps {
  inventory: UserInventory;
  topMatch: Opportunity | null;
  onSparkle?: () => void;
}

export const ShareCard: React.FC<ShareCardProps> = ({ inventory, topMatch, onSparkle }) => {
  const [downloading, setDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Extract concise bullet points of inventory
  const assetPills: string[] = [];
  if (inventory.money && inventory.money.amount > 0) {
    const symbol = inventory.money.currency === 'INR' ? '₹' : inventory.money.currency === 'EUR' ? '€' : inventory.money.currency === 'GBP' ? '£' : '$';
    assetPills.push(`${symbol}${inventory.money.amount.toLocaleString()} spare change`);
  }
  if (inventory.time && inventory.time.hours > 0) {
    assetPills.push(`${inventory.time.hours} hr${inventory.time.hours > 1 ? 's' : ''} ${inventory.time.when}`);
  }
  inventory.languages.forEach((lang) => assetPills.push(`Fluency in ${lang}`));
  inventory.objects.forEach((obj) => assetPills.push(`Spare ${obj.item}`));
  inventory.skills.forEach((skill) => assetPills.push(`${skill.name}`));
  inventory.access.forEach((acc) => assetPills.push(acc.type));

  const displayPills = assetPills.slice(0, 4);

  const handleDownload = () => {
    setDownloading(true);
    if (onSparkle) onSparkle();

    const canvas = hiddenCanvasRef.current;
    if (!canvas) {
      setDownloading(false);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setDownloading(false);
      return;
    }

    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    // 1. Draw warm gradient background (peach -> lemon chiffon -> soft cyan/powder blue)
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#FFDAB9'); // Peach
    gradient.addColorStop(0.5, '#FFFACD'); // Lemon Chiffon
    gradient.addColorStop(1, '#E0F2F7'); // Soft sky blue
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 2. White central card with soft rounded corners
    const cardX = 80;
    const cardY = 80;
    const cardW = width - 160;
    const cardH = height - 160;
    const radius = 48;

    ctx.save();
    ctx.shadowColor = 'rgba(217, 119, 6, 0.15)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 16;
    ctx.fillStyle = '#FFFDF9';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, radius);
    ctx.fill();
    ctx.restore();

    // Border
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, radius);
    ctx.stroke();

    // 3. Header badge
    ctx.fillStyle = '#F59E0B';
    ctx.font = '700 32px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SPARE • INTERNATIONAL DAY OF CHARITY', width / 2, cardY + 90);

    // Title
    ctx.fillStyle = '#1C1917';
    ctx.font = '800 58px "Outfit", sans-serif';
    ctx.fillText('I found my Spare', width / 2, cardY + 175);

    // Subtitle
    ctx.fillStyle = '#78716C';
    ctx.font = '400 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Nothing you have is too small to make a quiet ripple.', width / 2, cardY + 225);

    // Divider line
    ctx.strokeStyle = '#F3F4F6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cardX + 60, cardY + 270);
    ctx.lineTo(cardX + cardW - 60, cardY + 270);
    ctx.stroke();

    // Section 1: What I have spare
    ctx.fillStyle = '#D97706';
    ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('WHAT I BROUGHT TO THE TABLE:', cardX + 60, cardY + 330);

    let pillY = cardY + 370;
    displayPills.forEach((pill) => {
      ctx.fillStyle = '#FEF3C7';
      ctx.beginPath();
      ctx.roundRect(cardX + 60, pillY, cardW - 120, 56, 16);
      ctx.fill();

      ctx.fillStyle = '#92400E';
      ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`•  ${pill}`, cardX + 85, pillY + 38);
      pillY += 72;
    });

    // Section 2: My Move
    if (topMatch) {
      const matchBoxY = cardY + 680;
      ctx.fillStyle = '#ECFDF5';
      ctx.beginPath();
      ctx.roundRect(cardX + 60, matchBoxY, cardW - 120, 160, 24);
      ctx.fill();
      ctx.strokeStyle = '#A7F3D0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cardX + 60, matchBoxY, cardW - 120, 160, 24);
      ctx.stroke();

      ctx.fillStyle = '#065F46';
      ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('MY CHOSEN MOVE THIS WEEK', cardX + 90, matchBoxY + 45);

      ctx.fillStyle = '#064E3B';
      ctx.font = '800 36px "Outfit", sans-serif';
      ctx.fillText(topMatch.name, cardX + 90, matchBoxY + 95);

      ctx.fillStyle = '#047857';
      ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
      const truncatedAction = topMatch.action.length > 55 ? topMatch.action.slice(0, 52) + '...' : topMatch.action;
      ctx.fillText(truncatedAction, cardX + 90, matchBoxY + 135);
    }

    // Footer Watermark
    ctx.fillStyle = '#A8A29E';
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Discover what you have spare at spare.gives', width / 2, cardY + cardH - 45);

    // Convert to PNG download
    setTimeout(() => {
      try {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `my-spare-gifts.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.warn('Download card note:', err);
      } finally {
        setDownloading(false);
      }
    }, 200);
  };

  const handleShare = async () => {
    if (onSparkle) onSparkle();
    const shareText = `I just checked what I have spare right now on Spare (even small bits of time, money or skills count!). My top move this week is ${topMatch?.name || 'community giving'}. Try it out!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'I found my Spare',
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    await navigator.clipboard.writeText(shareText + ' ' + window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div id="share-card-container" className="mt-10 pt-8 border-t border-orange-200/40">
      <canvas ref={hiddenCanvasRef} className="hidden" />

      <div className="bg-white/90 rounded-[32px] p-7 sm:p-8 border border-white shadow-xl shadow-orange-900/5 relative overflow-hidden">
        {/* Subtle background warm illustration */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-200/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-sky-200/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-50 text-orange-800 text-xs font-bold tracking-wide uppercase mb-2 border border-orange-200/60">
                <HandHeart className="w-3.5 h-3.5 text-orange-600" />
                <span>Shareable Generosity Card</span>
              </div>
              <h3 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-stone-900">
                I found my Spare
              </h3>
              <p className="text-stone-600 text-sm mt-1">
                A warm snapshot of your assets & top move ready to share or save.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="download-share-card-btn"
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-orange-400 hover:bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-200/50 transition-all duration-150 active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? 'Creating image...' : 'Download PNG'}</span>
              </button>

              <button
                id="share-link-btn"
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-sm shadow-sm transition-all duration-150 active:scale-95 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-white">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-stone-400" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card Preview Previewing what gets exported */}
          <div className="bg-[#FFFDF9] rounded-2xl p-6 border border-orange-100 shadow-2xs">
            <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
              Your Spare Gifts
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {displayPills.map((pill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-50 border border-stone-200/80 text-stone-700 text-xs font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  {pill}
                </span>
              ))}
            </div>

            {topMatch && (
              <div className="p-4 rounded-2xl bg-[#FFF9F0] border border-orange-100/80 flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0 text-orange-600 shadow-2xs">
                  <HandHeart className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-orange-800 uppercase tracking-wide">
                    Top Action This Week
                  </div>
                  <div className="font-['Outfit'] font-bold text-stone-900 text-lg">
                    {topMatch.name}
                  </div>
                  <div className="text-stone-600 text-xs mt-0.5">
                    {topMatch.action}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
