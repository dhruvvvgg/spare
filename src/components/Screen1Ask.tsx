import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Mic, MicOff, Sparkles, MapPin, ArrowRight, Wand2, Sun, Heart, HandHeart, Info } from 'lucide-react';
import { DEMO_PERSONAS } from '../data/curatedOpportunities';
import { PersonaDemo } from '../types';

interface Screen1AskProps {
  userInput: string;
  setUserInput: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  errorMessage: string | null;
  onClearError: () => void;
}

export const Screen1Ask: React.FC<Screen1AskProps> = ({
  userInput,
  setUserInput,
  location,
  setLocation,
  onSubmit,
  isLoading,
  errorMessage,
  onClearError,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoMode, setGeoMode] = useState<'prompt' | 'granted' | 'manual' | 'skipped'>('prompt');
  const recognitionRef = useRef<any>(null);

  // Setup Web Speech API with feature check
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setUserInput(prev => (prev ? `${prev} ${transcript}` : transcript));
          if (onClearError) onClearError();
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Failed to init speech recognition:', e);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, [setUserInput, onClearError]);

  // Request browser geolocation with reverse geocoding
  const attemptGeolocation = () => {
    if (!('geolocation' in navigator)) {
      setGeoMode('manual');
      if (!location || location === 'unknown') setLocation('unknown');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`/api/geocode?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
          if (res.ok) {
            const data = await res.json();
            if (data.location) {
              setLocation(data.location);
              setGeoMode('granted');
              setGeoLoading(false);
              return;
            }
          }
        } catch (e) {
          console.warn('Geocoding error:', e);
        }
        setLocation(`Near you (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`);
        setGeoMode('granted');
        setGeoLoading(false);
      },
      (err) => {
        console.warn('Geolocation permission denied or timed out:', err.message);
        setGeoMode('manual');
        setGeoLoading(false);
        if (!location) setLocation('unknown');
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  };

  // Auto-attempt geolocation on mount if location is still unset/unknown
  useEffect(() => {
    if (!location || location === 'unknown') {
      if ('geolocation' in navigator && navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((result) => {
          if (result.state === 'granted') {
            attemptGeolocation();
          } else if (result.state === 'denied') {
            setGeoMode('manual');
            setLocation('unknown');
          } else {
            // Prompt or ask
            attemptGeolocation();
          }
        }).catch(() => {
          attemptGeolocation();
        });
      } else {
        setGeoMode('manual');
        setLocation('unknown');
      }
    } else {
      setGeoMode('granted');
    }
  }, []);

  const toggleMic = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert('Speech recognition is not supported in this browser environment. You can type directly in the box!');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        if (onClearError) onClearError();
      } catch (err) {
        console.warn('Mic start error:', err);
        setIsListening(false);
      }
    }
  };

  const handleApplyPersona = (persona: PersonaDemo) => {
    setSelectedPersonaId(persona.id);
    setUserInput(persona.prompt);
    setLocation(persona.location);
    setGeoMode('granted');
    if (onClearError) onClearError();
  };

  const handleAppendChip = (textToAppend: string) => {
    if (onClearError) onClearError();
    setUserInput(prev => {
      const trimmed = prev.trim();
      if (!trimmed) return textToAppend;
      if (trimmed.endsWith(',')) return `${trimmed} ${textToAppend}`;
      return `${trimmed}, ${textToAppend}`;
    });
  };

  const handleManualLocationChange = (val: string) => {
    if (!val || val.trim() === '') {
      setLocation('unknown');
    } else {
      setLocation(val);
    }
  };

  const handleSkipLocation = () => {
    setLocation('unknown');
    setGeoMode('skipped');
  };

  const handleFormSubmit = () => {
    if (!location || location.trim() === '' || location.toLowerCase() === 'worldwide') {
      setLocation('unknown');
    }
    onSubmit();
  };

  return (
    <motion.div
      id="screen-ask"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Warm Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 text-orange-950 border border-orange-200/60 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
          <HandHeart className="w-3.5 h-3.5 text-orange-600" />
          <span>International Day of Charity • Spare</span>
        </div>

        <h1 className="font-['Outfit'] text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
          What do you have <span className="text-orange-600 underline decoration-orange-300 decoration-wavy decoration-2">spare</span> right now?
        </h1>

        <p className="mt-3 text-base sm:text-lg text-stone-600 max-w-xl mx-auto leading-relaxed">
          Most giving apps ask <em>“how much money can you give?”</em> We flip it: 
          share whatever small pocket of time, skills, objects, or change you have today.
        </p>
      </div>

      {/* Main Ask Card */}
      <div className="bg-white/90 rounded-[32px] p-7 sm:p-9 shadow-xl shadow-orange-900/5 border border-white relative">
        {/* Text Box + Mic */}
        <div className="relative">
          <textarea
            id="spare-input-textarea"
            rows={4}
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
              if (onClearError) onClearError();
            }}
            placeholder="e.g. 200 rupees, my Saturday morning, I speak Gujarati, an old laptop I don't use, access to a quiet garden..."
            className="w-full rounded-2xl p-5 pr-14 text-stone-800 text-base sm:text-lg placeholder:text-stone-400/90 bg-[#FFFDF9] border border-orange-200/60 focus:border-orange-400 focus:outline-hidden focus:ring-4 focus:ring-orange-200/40 transition-all shadow-inner resize-none leading-relaxed"
          />

          {/* Mic Button */}
          <button
            id="mic-input-button"
            type="button"
            onClick={toggleMic}
            title={isListening ? 'Click to stop listening' : 'Voice input (speak what you have spare)'}
            className={`absolute right-3.5 top-3.5 p-3 rounded-2xl transition-all cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-md ring-4 ring-rose-200'
                : 'bg-orange-100/90 hover:bg-orange-200 text-orange-800 shadow-2xs'
            }`}
          >
            {isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Listening Indicator */}
        {isListening && (
          <div className="flex items-center gap-2 mt-2 px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>Listening to your voice... Speak naturally in any language!</span>
          </div>
        )}

        {/* Location Section: right after free-text input */}
        <div className="mt-4">
          {geoMode === 'granted' && location && location !== 'unknown' ? (
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-xs text-emerald-950">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-stone-700">Matching near:</span>
                <span className="font-bold text-stone-900 bg-white px-3 py-1 rounded-full border border-emerald-200/80 shadow-2xs">
                  📍 {location}
                </span>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setGeoMode('manual')}
                  className="text-xs text-stone-600 hover:text-stone-900 font-semibold underline underline-offset-2 cursor-pointer transition-colors"
                >
                  Change city
                </button>
                <span className="text-stone-300">•</span>
                <button
                  type="button"
                  onClick={handleSkipLocation}
                  className="text-xs text-stone-500 hover:text-stone-700 cursor-pointer transition-colors"
                >
                  Clear (match anywhere)
                </button>
              </div>
            </div>
          ) : geoMode === 'skipped' || location === 'unknown' ? (
            <div className="p-3 rounded-2xl bg-stone-50/80 border border-stone-200 flex items-center justify-between gap-2 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Location: <strong className="text-stone-800">Worldwide / Unknown</strong> (surfacing remote & general physical matches)</span>
              </div>
              <button
                type="button"
                onClick={() => setGeoMode('manual')}
                className="text-xs text-orange-700 hover:text-orange-800 font-bold underline cursor-pointer shrink-0"
              >
                Add my city
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <label htmlFor="city-input" className="text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                  <span>Which city or country are you in?</span>
                  <span className="text-xs font-normal text-stone-500">(helps me find things near you)</span>
                </label>
                <button
                  type="button"
                  onClick={handleSkipLocation}
                  className="text-xs text-stone-500 hover:text-stone-800 underline font-medium cursor-pointer self-start sm:self-auto"
                >
                  Skip
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  id="city-input"
                  type="text"
                  value={location === 'unknown' ? '' : location}
                  onChange={(e) => handleManualLocationChange(e.target.value)}
                  placeholder="e.g. Mumbai, Bengaluru, Delhi, Chicago, London..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-stone-200/90 text-stone-800 text-sm font-semibold placeholder:font-normal placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-orange-300 transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={attemptGeolocation}
                  disabled={geoLoading}
                  className="px-4 py-2.5 rounded-xl bg-orange-100/80 hover:bg-orange-200 text-orange-900 border border-orange-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95 disabled:opacity-60"
                  title="Detect GPS location"
                >
                  {geoLoading ? (
                    <span className="w-3.5 h-3.5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  )}
                  <span>{geoLoading ? 'Detecting...' : 'Use GPS'}</span>
                </button>
              </div>
              <p className="text-[11px] text-stone-500 mt-2 leading-normal">
                Helps us surface physical drop-off centres, food drives, and mutual aid in your neighborhood.
              </p>
            </div>
          )}
        </div>

        {/* Tappable Example Chips for blank box paralysis */}
        <div className="mt-5">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Need inspiration? Tap to add:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleAppendChip('₹250 or $10 spare change')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-50 hover:bg-orange-50/80 text-stone-700 hover:text-orange-900 text-xs font-semibold border border-stone-100 hover:border-orange-200 transition-all cursor-pointer active:scale-95"
            >
              <span>💰</span> A little money
            </button>
            <button
              type="button"
              onClick={() => handleAppendChip('2 spare hours this weekend')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-50 hover:bg-blue-50/80 text-stone-700 hover:text-blue-900 text-xs font-semibold border border-stone-100 hover:border-blue-200 transition-all cursor-pointer active:scale-95"
            >
              <span>⏰</span> Some free time
            </button>
            <button
              type="button"
              onClick={() => handleAppendChip('I speak Spanish and know how to make slides')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-50 hover:bg-emerald-50/80 text-stone-700 hover:text-emerald-900 text-xs font-semibold border border-stone-100 hover:border-emerald-200 transition-all cursor-pointer active:scale-95"
            >
              <span>🎓</span> A skill I have
            </button>
            <button
              type="button"
              onClick={() => handleAppendChip('an old working laptop and warm jacket')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-50 hover:bg-purple-50/80 text-stone-700 hover:text-purple-900 text-xs font-semibold border border-stone-100 hover:border-purple-200 transition-all cursor-pointer active:scale-95"
            >
              <span>📦</span> A physical item
            </button>
          </div>
        </div>

        {/* Error message fallback state (Guardrail) */}
        {errorMessage && (
          <div className="mt-4 p-4 rounded-2xl bg-orange-50 border border-orange-200 text-orange-950 text-sm flex items-start gap-3">
            <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold">Hmm, let's try that again!</div>
              <div className="text-xs text-orange-800 mt-0.5">{errorMessage}</div>
            </div>
            <button
              type="button"
              onClick={onClearError}
              className="text-xs text-orange-700 underline font-semibold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 pt-5 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-stone-500 text-center sm:text-left">
            Works with any language, currency, or local phrasing.
          </div>

          <button
            id="reveal-gifts-submit-btn"
            type="button"
            disabled={isLoading || !userInput.trim()}
            onClick={handleFormSubmit}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-orange-400 hover:bg-orange-500 text-white font-bold text-base shadow-lg shadow-orange-200/50 transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Unpacking what you have...</span>
              </>
            ) : (
              <>
                <span>Reveal my giving power</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Personas Section (Demo row for judges) */}
      <div className="mt-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Wand2 className="w-4 h-4 text-orange-600" />
          <span className="font-semibold text-stone-700 text-xs uppercase tracking-wider">
            Try a Demo (1-tap preview for judges)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DEMO_PERSONAS.map((persona) => {
            const isSelected = selectedPersonaId === persona.id;
            return (
              <button
                key={persona.id}
                id={`demo-persona-${persona.id}`}
                type="button"
                onClick={() => handleApplyPersona(persona)}
                className={`text-left p-4 rounded-[24px] border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-50/90 border-orange-300 ring-2 ring-orange-300 shadow-sm'
                    : 'bg-white/70 hover:bg-white border-white hover:border-orange-200 shadow-xs'
                }`}
              >
                <div className="text-2xl mb-1">{persona.icon}</div>
                <div className="font-['Outfit'] font-bold text-stone-900 text-sm">
                  {persona.title}
                </div>
                <div className="text-xs text-stone-500 line-clamp-2 mt-1">
                  {persona.role}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
