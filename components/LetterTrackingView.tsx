
import React from 'react';
import { Letter } from '../types';
import { MOCK_CONTACTS } from '../constants';

interface LetterTrackingViewProps {
  letter: Letter;
  onClose: () => void;
}

const LetterTrackingView: React.FC<LetterTrackingViewProps> = ({ letter, onClose }) => {
  const recipient = MOCK_CONTACTS.find(c => c.id === letter.recipientId) || { name: 'Friend', location: 'Unknown', avatar: '' };
  const now = Date.now();
  const progress = Math.min(100, ((now - letter.sentAt) / (letter.estimatedDeliveryAt - letter.sentAt)) * 100);
  const timeLeft = Math.max(0, Math.ceil((letter.estimatedDeliveryAt - now) / 60000));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-[430px] h-[90vh] bg-parchment overflow-y-auto overflow-x-hidden flex flex-col shadow-2xl border-x border-sepia-deep/10 rounded-lg">
        <div className="absolute inset-0 paper-grain z-50 pointer-events-none"></div>
        <header className="relative z-10 flex items-center p-6 pb-2 justify-between">
          <button 
            onClick={onClose}
            className="text-sepia-deep flex size-10 shrink-0 items-center justify-center rounded-sm hover:bg-sepia-deep/5 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h2 className="text-sepia-deep text-2xl font-serif-old italic leading-tight flex-1 text-center pr-10">The Journey of Your Letter</h2>
        </header>

        <section className="relative z-10 p-4">
          <div className="flex items-stretch justify-between gap-4 deckle-edge bg-[#fcf5e5] p-5 border-2 border-sepia-deep/10 rotate-[-0.5deg]">
            <div className="flex flex-col gap-1 flex-[2_2_0px]">
              <p className="text-sepia-deep/60 text-[10px] font-bold tracking-[0.2em] uppercase leading-normal font-typewriter">Ledger No. {letter.id.slice(-4)}</p>
              <p className="text-ink-blue text-xl font-serif-old font-bold leading-tight">Destined for {recipient.name}</p>
              <p className="text-sepia-deep/80 text-sm font-normal leading-normal italic font-display">{recipient.location}</p>
            </div>
            <div 
              className="w-24 h-24 bg-center bg-no-repeat bg-cover rounded-sm border border-sepia-deep/20 shadow-sm overflow-hidden sepia-[0.3]" 
              style={{ backgroundImage: `url(${recipient.avatar || 'https://picsum.photos/seed/recipient/100'})` }}
            />
          </div>
        </section>

        <section className="relative z-10">
          <h4 className="text-sepia-deep/70 text-xs font-typewriter leading-normal tracking-[0.1em] uppercase px-4 py-2 text-center italic">Aerial Courier Route</h4>
          <div className="flex px-4 py-3">
            <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden border-2 border-sepia-deep/20 shadow-inner vintage-map-container group">
              <div className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-60" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB-q-sJIW6whe7mVMl7Gg3AyZACFNCuwUyjuTAEg0-yDFesFR_OkDGhq6TSMacOvlxnbU1iuh1OiGvq4tDh_CuHuIzIswMgcQd2B1Rt0b0Sdot7UCCtE2418aGAOnRNsT_fJdJ1su9qQM0Ulc5p9gY0czZJIhtu0cEc9KDgI5PyQTN-xF9qyOSs2rO9mt4Lm0szyuYAw72LHw4DLAw03b8dZ3kBZ6kPaXBHcAzKsgPfgX8o9d2c4pqDOzyd3ofIQBrCvZvYvwQ_2p96")' }}></div>
              <svg className="absolute inset-0 w-full h-full p-8" viewBox="0 0 100 100">
                <path className="dashed-path" d="M 15 75 Q 50 20 85 35" fill="none" stroke="#2c3e50" strokeOpacity="0.6" strokeWidth="1.2" strokeDasharray="6"></path>
                <circle cx="15" cy="75" fill="#4a3728" r="2.5"></circle>
                <g transform={`translate(${15 + (70 * progress / 100)}, ${75 - (40 * progress / 100)})`}>
                  <text className="material-symbols-outlined text-ink-blue ink-stain" style={{ fontSize: '28px' }}>flutter_dash</text>
                </g>
              </svg>
              <div className="absolute bottom-10 left-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-sepia-deep text-sm">location_on</span>
                <span className="text-sepia-deep text-[10px] tracking-widest uppercase font-typewriter font-bold bg-parchment/80 px-1">Old Post House</span>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 px-6 mb-8 mt-4">
          <div className="grid grid-cols-[40px_1fr] gap-x-4">
            <div className="flex flex-col items-center gap-1 pt-2">
              <div className="text-sepia-deep/40 flex items-center justify-center p-1.5 rounded-full border border-sepia-deep/20 bg-sepia-deep/5">
                <span className="material-symbols-outlined text-[18px]">mark_email_unread</span>
              </div>
              <div className="w-[1px] border-l border-dashed border-sepia-deep/30 h-10 grow"></div>
            </div>
            <div className="flex flex-1 flex-col py-2 border-b border-sepia-deep/10">
              <div className="flex justify-between items-start">
                <p className="text-sepia-deep/60 text-base font-serif-old font-medium italic">Postmarked</p>
                <p className="text-sepia-deep/40 text-[10px] font-typewriter">{new Date(letter.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <p className="text-sepia-deep/80 text-sm font-display mt-0.5">Penned and sealed with wax.</p>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="w-[1px] border-l border-dashed border-sepia-deep/30 h-4"></div>
              <div className="text-ink-blue flex items-center justify-center p-2 rounded-full border border-ink-blue/40 bg-ink-blue/5 shadow-sm">
                <span className="material-symbols-outlined text-[20px] animate-pulse">flutter_dash</span>
              </div>
              <div className="w-[1px] border-l border-dashed border-sepia-deep/30 h-10 grow"></div>
            </div>
            <div className="flex flex-1 flex-col py-3 border-b border-sepia-deep/10">
              <div className="flex justify-between items-start">
                <p className="text-ink-blue text-lg font-serif-old font-bold">In Transit</p>
                <p className="text-ink-blue/70 text-[10px] font-typewriter font-bold">~{timeLeft} min</p>
              </div>
              <p className="text-sepia-deep text-sm font-display mt-0.5">The messenger traverses the countryside.</p>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="w-[1px] border-l border-dashed border-sepia-deep/30 h-4"></div>
              <div className="text-sepia-deep/30 flex items-center justify-center p-2 rounded-full border border-sepia-deep/10">
                <span className="material-symbols-outlined text-[18px]">local_post_office</span>
              </div>
            </div>
            <div className="flex flex-1 flex-col py-3 opacity-60">
              <div className="flex justify-between items-start">
                <p className="text-sepia-deep/80 text-base font-serif-old italic">Delivery Expected</p>
                <p className="text-sepia-deep/40 text-[10px] font-typewriter">{new Date(letter.estimatedDeliveryAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="relative z-10 mt-auto p-10 text-center">
          <div className="mb-6 opacity-30 select-none">
            <span className="material-symbols-outlined text-4xl text-sepia-deep">local_post_office</span>
          </div>
          <p className="text-sepia-deep/60 text-sm italic font-serif-old leading-relaxed">
            "A letter is a piece of time held in one's hand."
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LetterTrackingView;
