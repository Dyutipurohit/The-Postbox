
import React, { useState, useRef } from 'react';
import { Attachment, AttachmentType, Contact, Stamp } from '../types';
import { FONTS, PAPER_TYPES, STAMP_DESIGNS, calculateDeliveryTimeMs } from '../constants';
import { polishLetter } from '../services/geminiService';

interface LetterEditorProps {
  onSend: (letterData: any) => void;
  onCancel: () => void;
  contacts: Contact[];
  onSyncContacts: () => Promise<void>;
}

const LetterEditor: React.FC<LetterEditorProps> = ({ onSend, onCancel, contacts, onSyncContacts }) => {
  const [recipientId, setRecipientId] = useState(contacts[0]?.id || '');
  const [content, setContent] = useState('');
  const [font, setFont] = useState(FONTS[0].class);
  const [paper, setPaper] = useState(PAPER_TYPES[0]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [activeStamp, setActiveStamp] = useState<string | null>(null);
  const [isPolishing, setIsPolishing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      let type = AttachmentType.IMAGE;
      if (file.type.startsWith('audio/')) type = AttachmentType.AUDIO;
      if (file.type.startsWith('video/')) type = AttachmentType.VIDEO;

      setAttachments(prev => [...prev, {
        type,
        url: reader.result as string,
        name: file.name
      }]);
    };
    reader.readAsDataURL(file);
  };

  const handlePolish = async (tone: string) => {
    if (!content) return;
    setIsPolishing(true);
    const newContent = await polishLetter(content, tone);
    if (newContent) setContent(newContent);
    setIsPolishing(false);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await onSyncContacts();
    setIsSyncing(false);
  };

  const handlePaperClick = (e: React.MouseEvent) => {
    if (!activeStamp || !paperRef.current) return;

    const rect = paperRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newStamp: Stamp = {
      id: `stamp-${Date.now()}`,
      design: activeStamp,
      x,
      y,
      rotation: Math.random() * 40 - 20
    };

    setStamps(prev => [...prev, newStamp]);
  };

  const selectedContact = contacts.find(c => c.id === recipientId);
  const travelTimeHours = selectedContact ? selectedContact.distanceKm / 100 : 0;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-serif text-amber-900 italic">Crafting a Message...</h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">Cancel</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <section>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-amber-800">Recipient</label>
              <button 
                onClick={handleSync}
                disabled={isSyncing}
                className="text-[10px] uppercase tracking-tighter font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full border border-amber-200 transition-colors"
              >
                <svg className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Sync Contacts
              </button>
            </div>
            <select 
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              className="w-full p-3 rounded-lg border border-amber-200 bg-white focus:ring-2 focus:ring-amber-500 outline-none"
            >
              {contacts.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {selectedContact && (
              <p className="mt-2 text-xs text-amber-700 italic">
                Location: {selectedContact.location} • {selectedContact.distanceKm}km • Travel: {travelTimeHours.toFixed(1)} hours
              </p>
            )}
          </section>

          <section>
            <label className="block text-sm font-semibold text-amber-800 mb-2">Writing Style</label>
            <div className="grid grid-cols-2 gap-2">
              {FONTS.map(f => (
                <button
                  key={f.name}
                  onClick={() => setFont(f.class)}
                  className={`p-2 text-sm rounded border ${font === f.class ? 'bg-amber-100 border-amber-400' : 'bg-white border-gray-200'}`}
                >
                  <span className={f.class}>{f.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <label className="block text-sm font-semibold text-amber-800 mb-2">Wax Stamps</label>
            <div className="grid grid-cols-5 gap-2">
              {STAMP_DESIGNS.map(s => (
                <button
                  key={s}
                  onClick={() => setActiveStamp(s === activeStamp ? null : s)}
                  className={`w-10 h-10 flex items-center justify-center text-xl rounded-full border shadow-sm transition-all ${activeStamp === s ? 'bg-amber-800 border-amber-900 scale-110 shadow-lg' : 'bg-amber-100/50 border-amber-200 hover:bg-amber-100'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          <section>
            <label className="block text-sm font-semibold text-amber-800 mb-2">Multimedia</label>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
              Attach Memories
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,audio/*,video/*" />
          </section>

          <section>
            <label className="block text-sm font-semibold text-amber-800 mb-2">AI Scribe</label>
            <div className="flex flex-wrap gap-2">
              {['Romantic', 'Poetic', 'Concise'].map(tone => (
                <button
                  key={tone}
                  disabled={isPolishing}
                  onClick={() => handlePolish(tone.toLowerCase())}
                  className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs hover:bg-amber-100"
                >
                  {tone}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-2">
          <div 
            ref={paperRef}
            onClick={handlePaperClick}
            className={`${paper.class} min-h-[550px] rounded-lg shadow-xl border-2 p-8 md:p-12 transition-all duration-500 relative overflow-hidden ${activeStamp ? 'cursor-crosshair' : ''}`}
          >
            {stamps.map(s => (
              <div
                key={s.id}
                className="absolute pointer-events-none select-none transition-transform opacity-80"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  transform: `translate(-50%, -50%) rotate(${s.rotation}deg)`,
                  fontSize: '2.5rem'
                }}
              >
                <span className="filter drop-shadow-md brightness-75 contrast-125 saturate-50 mix-blend-multiply opacity-90">{s.design}</span>
              </div>
            ))}

            <div className="absolute top-8 right-8 text-xs font-serif text-gray-500 italic">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            
            <div className="mb-8">
              <span className="text-xl font-serif text-amber-900">Dearest {selectedContact?.name || 'Friend'},</span>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start your slow journey of words..."
              className={`w-full bg-transparent border-none focus:ring-0 resize-none min-h-[350px] text-xl text-gray-800 placeholder-gray-400 ${font}`}
            />

            <div className="mt-8 border-t border-amber-200/50 pt-8 flex justify-between items-end">
              <div>
                <p className="text-sm font-serif text-amber-900 mb-1">Sincerely,</p>
                <div className="text-2xl handwritten text-amber-800">You</div>
              </div>
              <button
                onClick={() => onSend({ recipientId, content, font, paper, attachments, stamps, distance: selectedContact?.distanceKm })}
                disabled={!content || !recipientId}
                className="px-10 py-4 bg-amber-800 text-white rounded-full font-bold shadow-2xl hover:bg-amber-900 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                Seal & Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterEditor;
