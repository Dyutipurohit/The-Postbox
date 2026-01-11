
import React, { useState, useEffect } from 'react';
import { Letter, LetterStatus, Contact } from '../types';

interface DashboardProps {
  letters: Letter[];
  contacts: Contact[];
  onOpenLetter: (letter: Letter) => void;
  onTrackLetter: (letter: Letter) => void;
  onNewLetter: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ letters, contacts, onOpenLetter, onTrackLetter, onNewLetter }) => {
  const [activeTab, setActiveTab] = useState<LetterStatus>(LetterStatus.RECEIVED);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getContact = (id: string) => contacts.find(c => c.id === id);

  const filteredLetters = letters.filter(l => {
    if (activeTab === LetterStatus.ARRIVING) {
      return l.status === LetterStatus.ARRIVING && l.estimatedDeliveryAt > now;
    }
    if (activeTab === LetterStatus.RECEIVED) {
      // Show received letters OR letters that were arriving but have now passed their delivery time
      return l.status === LetterStatus.RECEIVED || (l.status === LetterStatus.ARRIVING && l.estimatedDeliveryAt <= now);
    }
    return l.status === LetterStatus.SENT;
  });

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 relative">
        <div className="text-center md:text-left">
          <h1 className="text-6xl font-serif-old text-sepia-deep tracking-tight">Poste Restante</h1>
          <p className="text-sepia-deep/70 italic mt-2 font-display text-xl">The Old Registry & Sorting House</p>
        </div>
        <button
          onClick={onNewLetter}
          className="bg-sepia-deep text-parchment px-10 py-5 rounded-sm font-typewriter font-bold shadow-2xl hover:bg-sepia-deep/90 transition-all flex items-center gap-3 group border border-sepia-deep/20"
        >
          <span className="material-symbols-outlined">edit_note</span>
          Pen a New Letter
        </button>
      </header>

      <nav className="flex justify-center mb-10 bg-sepia-deep/5 p-1.5 border border-sepia-deep/10 shadow-inner max-w-lg mx-auto rounded-sm">
        {[
          { id: LetterStatus.ARRIVING, label: 'En Route', icon: 'flutter_dash' },
          { id: LetterStatus.RECEIVED, label: 'Postbox', icon: 'mark_email_unread' },
          { id: LetterStatus.SENT, label: 'Dispatch', icon: 'send' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-typewriter font-bold tracking-widest uppercase transition-all ${
              activeTab === tab.id ? 'bg-sepia-deep text-parchment shadow-md' : 'text-sepia-deep/60 hover:text-sepia-deep'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredLetters.length > 0 ? (
          filteredLetters.map(letter => {
            const sender = getContact(letter.senderId);
            const recipient = getContact(letter.recipientId);
            const person = activeTab === LetterStatus.SENT ? recipient : sender;
            const isArriving = activeTab === LetterStatus.ARRIVING;

            return (
              <div
                key={letter.id}
                onClick={() => isArriving ? onTrackLetter(letter) : onOpenLetter(letter)}
                className={`group bg-parchment p-8 border-2 border-sepia-deep/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative deckle-edge ${isArriving ? 'opacity-90' : ''}`}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-sepia-deep/5 group-hover:bg-sepia-deep/10 transition-colors"></div>
                
                <div className="flex items-center gap-5 mb-6">
                  <div className="relative">
                    <img src={person?.avatar} alt={person?.name} className="w-14 h-14 rounded-sm border border-sepia-deep/20 sepia-[0.3]" />
                    {isArriving && (
                       <div className="absolute -bottom-1 -right-1 bg-ink-blue text-parchment rounded-full p-1 border border-parchment">
                        <span className="material-symbols-outlined text-[12px] animate-spin">autorenew</span>
                       </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif-old text-xl text-sepia-deep font-bold italic">{person?.name}</h3>
                    <p className="text-[10px] font-typewriter uppercase tracking-widest text-sepia-deep/60">{person?.location}</p>
                  </div>
                </div>

                <div className="h-[2px] w-12 bg-sepia-deep/10 mb-6"></div>

                <p className="text-base text-charcoal/80 line-clamp-2 mb-6 font-display italic leading-relaxed">
                  "{letter.content}"
                </p>

                <div className="flex justify-between items-center text-[10px] font-typewriter font-bold uppercase tracking-widest text-sepia-deep/50 pt-4 border-t border-sepia-deep/5">
                  <span>{new Date(letter.sentAt).toLocaleDateString()}</span>
                  <span>{letter.distance} km</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-sepia-deep/10 rounded-sm">
            <span className="material-symbols-outlined text-6xl text-sepia-deep/10 mb-4">drafts</span>
            <p className="text-2xl font-serif-old italic text-sepia-deep/30">The post is quiet today...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
