import React, { useState } from 'react';
import { X, Calendar, Clock, Sparkles, CheckCircle2, User, ShieldCheck } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFreq?: number;
}

const THERAPIES = [
  { id: 'bio', title: 'Bio-Resonance Frequency Alignment', duration: '60 min', description: 'Harmonizes bio-fields using customized Solfeggio sound baths.' },
  { id: 'cellular', title: 'Cellular Light Alchemy & Sound Bath', duration: '75 min', description: 'Deep cellular rejuvenation with light spectrums and acoustic waves.' },
  { id: 'equilibrium', title: 'Integrative Energy Equilibrium', duration: '90 min', description: 'Full holistic energy mapping, breathwork sync, and deep vitality realignment.' },
];

const PRACTITIONERS = [
  { name: 'Dr. Briana Vance', role: 'Bio-Energetic Master Specialist' },
  { name: 'Saman Malik', role: 'Solfeggio Sound Alchemist' },
  { name: 'Omar Raza', role: 'Holistic Vitality Director' },
];

export function BookingModal({ isOpen, onClose, selectedFreq = 432 }: BookingModalProps) {
  const [therapy, setTherapy] = useState(THERAPIES[0].id);
  const [practitioner, setPractitioner] = useState(PRACTITIONERS[0].name);
  const [date, setDate] = useState('2026-08-01');
  const [time, setTime] = useState('10:00 AM');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity duration-300">
      <div className="relative w-full max-w-xl liquid-glass rounded-3xl p-6 sm:p-8 border border-white/25 text-white shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Background glow ornament */}
        <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close session booking dialog"
          className="absolute top-5 right-5 p-2 rounded-full liquid-glass border border-white/20 text-white/70 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-white/80" />
              <span className="text-xs uppercase tracking-widest text-white/70 font-light">
                Sanctuary Reservations
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-normal tracking-tight text-white mb-2">
              Reserve Your Sanctuary Session
            </h3>
            <p className="text-xs sm:text-sm text-white/70 font-light mb-6">
              Experience personalized bio-energetic alignment at {selectedFreq} Hz.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Therapy Selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-2">
                  Select Sanctuary Session
                </label>
                <div className="space-y-2">
                  {THERAPIES.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setTherapy(item.id)}
                      className={`w-full text-left p-3.5 rounded-2xl transition border cursor-pointer ${
                        therapy === item.id
                          ? 'bg-white/20 border-white/50 text-white shadow-inner'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.title}</span>
                        <span className="text-xs text-white/60 font-light flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.duration}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 font-light mt-1">{item.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Practitioner & Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5">
                    Practitioner
                  </label>
                  <select
                    value={practitioner}
                    onChange={(e) => setPractitioner(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white/50 cursor-pointer"
                  >
                    {PRACTITIONERS.map((p) => (
                      <option key={p.name} value={p.name} className="bg-neutral-900 text-white">
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5">
                    Preferred Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white/50 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Alex Rivers"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl liquid-glass border border-white/30 text-white font-medium text-sm hover:bg-white/20 transition duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <ShieldCheck className="w-4 h-4 text-white/90" />
                Confirm Sanctuary Reservation
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full liquid-glass border border-white/40 flex items-center justify-center mx-auto text-white shadow-xl animate-bounce">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-normal text-white">Session Confirmed</h3>
            <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto font-light leading-relaxed">
              Thank you, <span className="font-semibold text-white">{name || 'Valued Guest'}</span>. Your reservation for{' '}
              <span className="font-semibold text-white">{THERAPIES.find((t) => t.id === therapy)?.title}</span> with{' '}
              <span className="font-semibold text-white">{practitioner}</span> on {date} at {time} has been secured.
            </p>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-xs text-white/80 max-w-sm mx-auto">
              A confirmation email has been sent to <span className="text-white font-medium">{email || 'your email'}</span> along with arrival preparation guidelines.
            </div>
            <button
              onClick={handleReset}
              className="mt-4 px-8 py-3 rounded-full liquid-glass border border-white/30 text-white font-medium text-xs hover:bg-white/20 transition cursor-pointer"
            >
              Return to Sanctuary
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingModal;
