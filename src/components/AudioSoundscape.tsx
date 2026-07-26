import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, Disc, Sliders } from 'lucide-react';

interface AudioSoundscapeProps {
  currentFreq: number;
  onFreqChange: (freq: number) => void;
}

export const FREQUENCIES = [
  { freq: 432, label: '432 Hz', name: 'Miracle Healing', description: 'Harmonizes cellular vibration & deep inner calm' },
  { freq: 528, label: '528 Hz', name: 'Transformation', description: 'Promotes DNA repair & cosmic energy alignment' },
  { freq: 639, label: '639 Hz', name: 'Harmonic Connection', description: 'Enhances relationship resonance & heart coherence' },
  { freq: 741, label: '741 Hz', name: 'Intuitive Clarity', description: 'Purifies energy field & unlocks deep insight' },
];

export function AudioSoundscape({ currentFreq, onFreqChange }: AudioSoundscapeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const stopAudio = () => {
    if (gainRef.current && audioCtxRef.current) {
      // Smooth fade out
      gainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.2);
      setTimeout(() => {
        try {
          osc1Ref.current?.stop();
          osc2Ref.current?.stop();
          osc1Ref.current?.disconnect();
          osc2Ref.current?.disconnect();
        } catch {
          // ignore
        }
        osc1Ref.current = null;
        osc2Ref.current = null;
      }, 300);
    }
  };

  const startAudio = (freq: number) => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      // Stop previous oscillators if running
      stopAudio();

      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.setTargetAtTime(0.06, now, 0.4); // soft ambient volume

      // Lowpass Filter for warm soothing tone
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);

      // Binaural Oscillators (main frequency + slight 4Hz binaural beat for theta relaxation)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq + 4, now); // 4Hz theta wave binaural pulse

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);

      osc1Ref.current = osc1;
      osc2Ref.current = osc2;
      gainRef.current = masterGain;
    } catch (e) {
      console.warn('Web Audio API initialized on user interaction:', e);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      startAudio(currentFreq);
      setIsPlaying(true);
    }
  };

  const handleSelectFreq = (freq: number) => {
    onFreqChange(freq);
    if (isPlaying) {
      startAudio(freq);
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div className="relative z-30">
      {/* Trigger Pill */}
      <div className="flex items-center gap-1.5 liquid-glass rounded-full p-1.5 sm:px-3 sm:py-1.5">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Mute Solfeggio sound bath' : 'Play Solfeggio sound bath'}
          className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-4 h-4 text-white animate-pulse" />
              <span className="absolute inset-0 rounded-full border border-white/40 animate-ping opacity-40 pointer-events-none" />
            </>
          ) : (
            <VolumeX className="w-4 h-4 text-white/70" />
          )}
        </button>

        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="hidden sm:flex items-center gap-2 text-xs font-medium text-white/90 hover:text-white transition px-2 py-1 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-white/80" />
          <span>{currentFreq} Hz Bath</span>
          <Sliders className="w-3 h-3 text-white/60 ml-0.5" />
        </button>
      </div>

      {/* Floating Sound Bath Panel */}
      {panelOpen && (
        <div className="absolute right-0 top-12 w-72 sm:w-80 liquid-glass rounded-2xl p-5 shadow-2xl border border-white/20 text-white backdrop-blur-2xl transition-all duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Disc className={`w-4 h-4 text-white ${isPlaying ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">Solfeggio Sound Bath</span>
            </div>
            <button
              onClick={() => setPanelOpen(false)}
              className="text-xs text-white/60 hover:text-white cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {FREQUENCIES.map((item) => (
              <button
                key={item.freq}
                onClick={() => handleSelectFreq(item.freq)}
                className={`w-full text-left p-3 rounded-xl transition duration-200 border cursor-pointer ${
                  currentFreq === item.freq
                    ? 'bg-white/20 border-white/40 text-white shadow-inner'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">{item.label}</span>
                  <span className="text-[10px] text-white/60 uppercase tracking-widest">{item.name}</span>
                </div>
                <div className="text-[11px] font-light text-white/70 mt-1">{item.description}</div>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-white/60">
              {isPlaying ? '♪ Playing 4Hz binaural pulse' : 'Audio paused'}
            </span>
            <button
              onClick={togglePlay}
              className="text-xs font-medium px-3 py-1.5 rounded-full liquid-glass border border-white/30 text-white hover:bg-white/20 transition cursor-pointer"
            >
              {isPlaying ? 'Pause Audio' : 'Start Audio'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AudioSoundscape;
