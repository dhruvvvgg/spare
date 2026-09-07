import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { UserInventory } from '../types';
import {
  Coins,
  Clock,
  Globe,
  GraduationCap,
  Package,
  Key,
  Heart,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface Screen2InventoryProps {
  inventory: UserInventory;
  onAdvance: () => void;
  onBack: () => void;
}

interface InventoryCardItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ReactNode;
  theme: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    badgeText: string;
  };
}

export const Screen2Inventory: React.FC<Screen2InventoryProps> = ({
  inventory,
  onAdvance,
  onBack,
}) => {
  const [timeLeft, setTimeLeft] = useState(4);
  const [isPaused, setIsPaused] = useState(false);

  // Compile list of cards to display
  const items: InventoryCardItem[] = [];

  // Money
  if (inventory.money && inventory.money.amount > 0) {
    const symbol =
      inventory.money.currency === 'INR'
        ? '₹'
        : inventory.money.currency === 'EUR'
        ? '€'
        : inventory.money.currency === 'GBP'
        ? '£'
        : '$';
    items.push({
      id: 'inv-money',
      category: 'Financial Capital',
      title: `${symbol}${inventory.money.amount.toLocaleString()} ${inventory.money.currency}`,
      subtitle: 'Small amounts fund real meals, medicine, and critical supplies.',
      badge: 'Immediate Purchasing Power',
      icon: <Coins className="w-6 h-6 text-amber-600" />,
      theme: {
        bg: 'bg-amber-50/90',
        border: 'border-amber-200',
        text: 'text-amber-950',
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-900',
      },
    });
  }

  // Time
  if (inventory.time && inventory.time.hours > 0) {
    const hours = inventory.time.hours;
    const when = inventory.time.when || 'on your schedule';
    items.push({
      id: 'inv-time',
      category: 'Time & Attention',
      title: `${hours} hour${hours > 1 ? 's' : ''} • ${when}`,
      subtitle: inventory.time.recurring
        ? 'Reliable recurring presence can mentor or support a whole community.'
        : 'Even 15 to 30 uninterrupted minutes can solve someone’s emergency block.',
      badge: 'Direct Human Presence',
      icon: <Clock className="w-6 h-6 text-sky-600" />,
      theme: {
        bg: 'bg-sky-50/90',
        border: 'border-sky-200',
        text: 'text-sky-950',
        badgeBg: 'bg-sky-100',
        badgeText: 'text-sky-900',
      },
    });
  }

  // Languages
  if (inventory.languages && inventory.languages.length > 0) {
    items.push({
      id: 'inv-languages',
      category: 'Linguistic Bridge',
      title: inventory.languages.join(' & '),
      subtitle: 'Fluency breaks isolation for refugees, patients, and global learners.',
      badge: 'Vital Cultural Lifeline',
      icon: <Globe className="w-6 h-6 text-emerald-600" />,
      theme: {
        bg: 'bg-emerald-50/90',
        border: 'border-emerald-200',
        text: 'text-emerald-950',
        badgeBg: 'bg-emerald-100',
        badgeText: 'text-emerald-900',
      },
    });
  }

  // Skills
  inventory.skills.forEach((skill, idx) => {
    items.push({
      id: `inv-skill-${idx}`,
      category: 'Hands-on Skill',
      title: skill.name,
      subtitle: `Your ability in ${skill.name} saves grassroots nonprofits hours of struggle.`,
      badge: skill.level ? `${skill.level} capability` : 'Community superpower',
      icon: <GraduationCap className="w-6 h-6 text-purple-600" />,
      theme: {
        bg: 'bg-purple-50/90',
        border: 'border-purple-200',
        text: 'text-purple-950',
        badgeBg: 'bg-purple-100',
        badgeText: 'text-purple-900',
      },
    });
  });

  // Objects
  inventory.objects.forEach((obj, idx) => {
    items.push({
      id: `inv-obj-${idx}`,
      category: 'Physical Asset',
      title: obj.item,
      subtitle: obj.condition ? `Condition: ${obj.condition}. Gives tangible dignity to someone in need.` : 'Tangible utility ready to be passed on.',
      badge: 'Direct Reuse Value',
      icon: <Package className="w-6 h-6 text-rose-600" />,
      theme: {
        bg: 'bg-rose-50/90',
        border: 'border-rose-200',
        text: 'text-rose-950',
        badgeBg: 'bg-rose-100',
        badgeText: 'text-rose-900',
      },
    });
  });

  // Access
  inventory.access.forEach((acc, idx) => {
    items.push({
      id: `inv-acc-${idx}`,
      category: 'Resource Access',
      title: acc.type,
      subtitle: 'Opening up space or equipment creates communal leverage without spending a cent.',
      badge: 'Commons Multiplier',
      icon: <Key className="w-6 h-6 text-indigo-600" />,
      theme: {
        bg: 'bg-indigo-50/90',
        border: 'border-indigo-200',
        text: 'text-indigo-950',
        badgeBg: 'bg-indigo-100',
        badgeText: 'text-indigo-900',
      },
    });
  });

  // Guarantee at least one card
  if (items.length === 0) {
    items.push({
      id: 'inv-generosity',
      category: 'Generous Heart',
      title: 'A Willingness to Step Up',
      subtitle: 'You showed up ready to share whatever comes up. That is where all charity starts.',
      badge: 'Core Giving Spirit',
      icon: <Heart className="w-6 h-6 text-amber-600 fill-amber-400" />,
      theme: {
        bg: 'bg-amber-50/90',
        border: 'border-amber-200',
        text: 'text-amber-950',
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-900',
      },
    });
  }

  const onAdvanceRef = useRef(onAdvance);
  useEffect(() => {
    onAdvanceRef.current = onAdvance;
  }, [onAdvance]);

  // Auto-advance timer (4 seconds) - safely triggers onAdvance outside of render or state updater
  useEffect(() => {
    if (isPaused) return;

    if (timeLeft <= 0) {
      onAdvanceRef.current();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isPaused]);

  return (
    <motion.div
      id="screen-inventory-reveal"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-3xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-stone-600 hover:text-stone-900 text-sm font-semibold transition-colors cursor-pointer py-1.5 px-3.5 rounded-full bg-white/50 border border-white/60 hover:bg-white/80 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit my gifts</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-500 font-medium hidden sm:inline">
            Advancing in <strong className="text-stone-800">{timeLeft}s</strong>
          </span>
          <button
            id="advance-to-moves-btn"
            type="button"
            onClick={onAdvance}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-400 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-200/50 transition-all active:scale-95 cursor-pointer"
          >
            <span>Show what I can do</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Emotional Beat Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 text-orange-950 border border-orange-200/60 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Your Spare Inventory</span>
        </div>

        <h2 className="font-['Outfit'] text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight mb-2">
          Look what you actually have.
        </h2>
        <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
          You have so much more to give than you thought. Like gifts laid out on a table, 
          each of these is a bridge waiting to connect.
        </p>
      </div>

      {/* Animated Staggered Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.45,
              delay: index * 0.15, // 150ms stagger
              ease: [0.21, 1.02, 0.49, 0.99],
            }}
            className="p-6 sm:p-7 rounded-[32px] border border-white bg-white/90 shadow-xl shadow-orange-900/5 hover:shadow-2xl transition-shadow relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center shadow-2xs border border-white/60">
                {item.icon}
              </div>
              <span
                className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${item.theme.badgeBg} ${item.theme.badgeText} border border-white/70`}
              >
                {item.badge}
              </span>
            </div>

            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
              {item.category}
            </div>

            <div className="font-['Outfit'] text-2xl font-bold text-stone-900 mb-2">
              {item.title}
            </div>

            <p className="text-stone-500 text-sm leading-relaxed">
              {item.subtitle}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar for Auto-Advance */}
      <div className="w-full bg-stone-200/50 h-2 rounded-full overflow-hidden mb-6">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 4, ease: 'linear' }}
          className="h-full bg-orange-400 rounded-full"
        />
      </div>

      {/* Bottom CTA */}
      <div className="text-center">
        <button
          id="show-moves-bottom-cta"
          type="button"
          onClick={onAdvance}
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-orange-400 hover:bg-orange-500 text-white font-bold text-base shadow-lg shadow-orange-200/50 transition-all active:scale-95 cursor-pointer"
        >
          <span>See my 3 specific moves</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
