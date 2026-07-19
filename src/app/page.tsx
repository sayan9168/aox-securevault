'use client';
import { useState } from 'react';
import VaultScene from '@/components/VaultScene';
import { encrypt, decrypt } from '@/lib/crypto';
import { Lock, Unlock, Github, Instagram, Mail, X } from 'lucide-react';

export default function Home() {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');

  const handleUnlock = async () => {
    if (password.length < 8) {
      setError('Master password must be ≥ 8 characters');
      return;
    }
    // For Day 1 demo: just validate password strength
    // Real app would attempt to decrypt stored vault data
    setUnlocked(true);
    setError('');
  };

  return (
    <main className="min-h-screen bg-aox-dark text-white font-mono p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2">
          AOX <span className="text-aox-accent">SecureVault</span>
        </h1>
        <p className="text-white/50 text-sm">SAYANOX PRIVATE LIMITED • V1.1</p>
      </header>

      {/* 3D Vault */}
      <section className="mb-8">
        <VaultScene unlocked={unlocked} />
      </section>

      {/* Auth Panel */}
      {!unlocked ? (
        <div className="bg-aox-surface p-6 rounded-xl border border-white/5 max-w-md mx-auto">
          <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
            Master Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-aox-accent transition-colors"
            placeholder="Enter master password..."
            autoFocus
          />
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          <button
            onClick={handleUnlock}
            className="mt-4 w-full bg-aox-accent hover:bg-aox-glow text-white py-3 rounded-lg font-bold tracking-wide transition-all flex items-center justify-center gap-2"
          >
            <Unlock size={18} /> UNLOCK VAULT
          </button>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 text-green-400 mb-4">
            <Lock size={20} /> VAULT UNLOCKED
          </div>
          <p className="text-white/50">Day 1 MVP — Encryption engine ready.</p>
          <button
            onClick={() => { setUnlocked(false); setPassword(''); }}
            className="mt-6 text-xs text-white/30 hover:text-white/60 underline"
          >
            Re-lock Vault
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-white/30">
        <a href="mailto:sm6881164@gmail.com" className="flex items-center gap-2 hover:text-aox-accent transition-colors">
          <Mail size={14} /> sm6881164@gmail.com
        </a>
        <a href="https://instagram.com/_sayyyyan" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-aox-accent transition-colors">
          <Instagram size={14} /> @_sayyyyan
        </a>
        <a href="https://x.com/notfound_sayan" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-aox-accent transition-colors">
          <X size={14} /> @notfound_sayan
        </a>
        <a href="https://github.com/sayan9168" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-aox-accent transition-colors">
          <Github size={14} /> sayan9168
        </a>
      </footer>
    </main>
  );
        }
