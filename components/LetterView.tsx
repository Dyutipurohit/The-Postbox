
import React from 'react';
import { Letter, AttachmentType } from '../types';
import { MOCK_CONTACTS } from '../constants';

interface LetterViewProps {
  letter: Letter;
  onClose: () => void;
}

const LetterView: React.FC<LetterViewProps> = ({ letter, onClose }) => {
  const sender = MOCK_CONTACTS.find(c => c.id === letter.senderId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[95vh] overflow-y-auto bg-transparent">
        <button 
          onClick={onClose}
          className="absolute -top-6 -right-6 bg-parchment text-sepia-deep w-12 h-12 rounded-sm border border-sepia-deep/20 flex items-center justify-center shadow-xl hover:bg-sepia-deep hover:text-parchment transition-all z-10"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className={`${letter.paperType} min-h-[700px] p-10 md:p-20 shadow-2xl border-2 border-sepia-deep/10 relative overflow-hidden deckle-edge`}>
          <div className="absolute inset-0 paper-grain pointer-events-none"></div>

          {/* Stamps Layer */}
          {(letter.stamps || []).map(s => (
            <div
              key={s.id}
              className="absolute pointer-events-none select-none transition-transform opacity-70"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                transform: `translate(-50%, -50%) rotate(${s.rotation}deg)`,
                fontSize: '2.5rem'
              }}
            >
              <span className="filter drop-shadow-md brightness-75 contrast-125 saturate-50 mix-blend-multiply">{s.design}</span>
            </div>
          ))}

          <div className="flex justify-between items-start mb-16 relative z-10">
            <div className="flex items-center gap-5">
              <img src={sender?.avatar} alt={sender?.name} className="w-16 h-16 rounded-sm border border-sepia-deep/20 sepia-[0.3]" />
              <div>
                <p className="font-serif-old text-2xl text-sepia-deep italic font-bold leading-tight">{sender?.name}</p>
                <p className="text-[10px] font-typewriter uppercase tracking-widest text-sepia-deep/60">{sender?.location}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-typewriter font-bold text-sepia-deep/50 uppercase tracking-tighter">
                {new Date(letter.sentAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-[10px] text-ink-blue uppercase font-bold tracking-[0.2em] mt-2 bg-ink-blue/5 px-2 py-1">
                {letter.distance} km traveled
              </p>
            </div>
          </div>

          <div className={`text-2xl leading-[1.6] whitespace-pre-wrap mb-16 text-charcoal/90 relative z-10 font-display italic`}>
            {letter.content}
          </div>

          {letter.attachments.length > 0 && (
            <div className="border-t border-sepia-deep/10 pt-10 mt-16 relative z-10">
              <h4 className="text-[10px] font-typewriter font-bold uppercase tracking-[0.3em] text-sepia-deep/40 mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-[16px]">attach_file</span>
                Enclosures
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {letter.attachments.map((a, i) => (
                  <div key={i} className="bg-sepia-deep/5 p-3 border border-sepia-deep/10 deckle-edge overflow-hidden">
                    {a.type === AttachmentType.IMAGE && (
                      <img src={a.url} alt="Enclosure" className="w-full h-40 object-cover rounded-sm sepia-[0.2]" />
                    )}
                    {a.type === AttachmentType.AUDIO && (
                      <div className="h-40 flex flex-col items-center justify-center bg-sepia-deep/10 rounded-sm">
                        <span className="material-symbols-outlined text-4xl text-sepia-deep/40">volume_up</span>
                        <audio controls className="w-full mt-4 h-8" src={a.url}></audio>
                      </div>
                    )}
                    {a.type === AttachmentType.VIDEO && (
                      <video controls className="w-full h-40 object-cover rounded-sm" src={a.url}></video>
                    )}
                    <p className="text-[10px] font-typewriter text-sepia-deep/60 mt-3 truncate">{a.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LetterView;
