
import React, { useState, useEffect } from 'react';
import { Letter, LetterStatus, Contact } from './types';
import { MOCK_CONTACTS, calculateDeliveryTimeMs } from './constants';
import Dashboard from './components/Dashboard';
import LetterEditor from './components/LetterEditor';
import LetterView from './components/LetterView';
import LetterTrackingView from './components/LetterTrackingView';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'compose'>('dashboard');
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [trackingLetter, setTrackingLetter] = useState<Letter | null>(null);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);

  useEffect(() => {
    const storedLetters = localStorage.getItem('snailmail_letters');
    const storedContacts = localStorage.getItem('snailmail_contacts');
    
    if (storedLetters) setLetters(JSON.parse(storedLetters));
    if (storedContacts) setContacts(JSON.parse(storedContacts));
    
    if (!storedLetters) {
      const initialLetters: Letter[] = [
        {
          id: 'mock-1',
          senderId: '1',
          recipientId: 'current-user',
          content: "I hope this letter finds you well. It's been a while since we spoke, and I've been thinking about the walk we took by the river last summer.",
          font: 'serif',
          paperType: 'bg-[#f4e4bc] border-[#d4c49c]',
          attachments: [],
          stamps: [{ id: 's1', design: '🕊️', x: 80, y: 15, rotation: 10 }],
          sentAt: Date.now() - 3600000 * 2,
          estimatedDeliveryAt: Date.now() - 3600000,
          status: LetterStatus.RECEIVED,
          distance: 450
        }
      ];
      setLetters(initialLetters);
      localStorage.setItem('snailmail_letters', JSON.stringify(initialLetters));
    }
  }, []);

  const handleSyncContacts = async () => {
    if (!('contacts' in navigator && 'ContactsManager' in window)) {
      alert("Your browser doesn't support the Contact Picker API. Try on a mobile device!");
      return;
    }

    try {
      const props = ['name', 'email'];
      const opts = { multiple: true };
      const deviceContacts = await (navigator as any).contacts.select(props, opts);
      
      const newContacts: Contact[] = deviceContacts.map((c: any, index: number) => ({
        id: `device-${Date.now()}-${index}`,
        name: c.name[0] || 'Unknown Contact',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name[0])}&background=random`,
        location: 'Virtual Location',
        distanceKm: Math.floor(Math.random() * 8000) + 100
      }));

      const merged = [...contacts, ...newContacts];
      const unique = Array.from(new Map(merged.map(item => [item['name'], item])).values());
      
      setContacts(unique);
      localStorage.setItem('snailmail_contacts', JSON.stringify(unique));
    } catch (err) {
      console.error("Sync failed:", err);
    }
  };

  const handleSend = (letterData: any) => {
    const deliveryTimeMs = calculateDeliveryTimeMs(letterData.distance || 100);
    const newLetter: Letter = {
      id: `letter-${Date.now()}`,
      senderId: 'current-user',
      recipientId: letterData.recipientId,
      content: letterData.content,
      font: letterData.font,
      paperType: letterData.paper.class,
      attachments: letterData.attachments,
      stamps: letterData.stamps,
      sentAt: Date.now(),
      estimatedDeliveryAt: Date.now() + deliveryTimeMs,
      status: LetterStatus.ARRIVING, // New letters are marked arriving
      distance: letterData.distance
    };

    const updated = [...letters, newLetter];
    setLetters(updated);
    localStorage.setItem('snailmail_letters', JSON.stringify(updated));
    setView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#e5d3b3] text-sepia-deep pb-20 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-0 paper-grain"></div>

      <main className="relative z-10">
        {view === 'dashboard' ? (
          <Dashboard 
            letters={letters} 
            contacts={contacts}
            onOpenLetter={(l) => setSelectedLetter(l)} 
            onTrackLetter={(l) => setTrackingLetter(l)}
            onNewLetter={() => setView('compose')} 
          />
        ) : (
          <LetterEditor 
            contacts={contacts} 
            onSend={handleSend} 
            onCancel={() => setView('dashboard')} 
            onSyncContacts={handleSyncContacts}
          />
        )}
      </main>

      {selectedLetter && (
        <LetterView 
          letter={selectedLetter} 
          onClose={() => setSelectedLetter(null)} 
        />
      )}

      {trackingLetter && (
        <LetterTrackingView 
          letter={trackingLetter} 
          onClose={() => setTrackingLetter(null)} 
        />
      )}

      <footer className="fixed bottom-0 left-0 right-0 bg-parchment/90 backdrop-blur-sm border-t border-sepia-deep/10 p-5 text-center z-40 shadow-2xl">
        <p className="text-xs font-serif-old italic text-sepia-deep/60">
          "A handwritten letter is a window into the soul." • Serving the digital postbox with the patience of the old world.
        </p>
      </footer>
    </div>
  );
};

export default App;
