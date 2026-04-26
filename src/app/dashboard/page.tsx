'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Zap, Copy, CreditCard, RefreshCw, LogOut, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isBuying, setIsBuying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth');
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!error) {
        setProfile(data);
      }
      setLoading(false);
    }

    getProfile();
  }, [router]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Simple toast could be added here
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleBuy = async (planId: string) => {
    setIsBuying(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, planId })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
    } finally {
      setIsBuying(false);
    }
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" color="var(--primary)" size={40} />
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-main)', position: 'relative' }}>
      <div className="bg-grid"></div>
      
      {/* Top Nav */}
      <nav className="nav">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <Link href="/" className="font-display" style={{ fontSize: '1.2rem', fontWeight: 800, textDecoration: 'none', color: 'white' }}>
            Deep<span className="text-gradient">Bridge</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user?.email}</span>
            <button onClick={handleSignOut} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'white', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
            {user?.email[0].toUpperCase()}
          </div>
          <h1 className="font-display" style={{ fontSize: '2rem' }}>Developer Console</h1>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
          {/* Real Balance Card */}
          <div className="glass" style={{ padding: '2.5rem', border: '1px solid var(--glow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>
              <Zap size={20} />
              <span style={{ fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Available Tokens</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              {profile?.balance_tokens?.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-muted)' }}>Tokens</span>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={14} color="#10b981" /> Account Status: Active
            </div>
          </div>

          {/* Real API Key Card */}
          <div className="glass" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--secondary)', marginBottom: '1.5rem' }}>
              <RefreshCw size={20} />
              <span style={{ fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Personal Key</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1.2rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
              <code style={{ fontSize: '0.9rem', color: 'var(--primary)', letterSpacing: '0.5px' }}>{profile?.api_key}</code>
              <button onClick={() => copyToClipboard(profile?.api_key)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }}>
                <Copy size={18} />
              </button>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Base URL: <code style={{ color: 'var(--text-white)' }}>https://deepbridge.sg/api/v1</code>
            </div>
          </div>
        </div>

        {/* Real Stripe Top Up */}
        <h2 className="font-display" style={{ fontSize: '1.5rem', marginBottom: '1.8rem' }}>Recharge Credits</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {[
            { id: 'basic', name: 'Starter Pack', tokens: '2M', price: '$1.00', color: 'var(--primary)' },
            { id: 'pro', name: 'Pro Dev', tokens: '10M', price: '$4.50', color: 'var(--secondary)' },
            { id: 'ultra', name: 'Scale Up', tokens: '25M', price: '$10.00', color: 'var(--accent)' },
          ].map((plan) => (
            <div key={plan.id} className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', transition: 'transform 0.2s' }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: plan.color }}>{plan.name}</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800 }}>{plan.tokens} <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-muted)' }}>Tokens</span></div>
              <div style={{ fontSize: '1.3rem', color: 'white', fontWeight: 600 }}>{plan.price}</div>
              <button 
                onClick={() => handleBuy(plan.id)}
                disabled={isBuying}
                className="btn-primary" 
                style={{ width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', height: '48px' }}
              >
                {isBuying ? <Loader2 className="animate-spin" /> : <CreditCard size={18} />} 
                Buy with Card
              </button>
            </div>
          ))}
        </div>

        {/* Enhanced Guide */}
        <div className="glass" style={{ marginTop: '4rem', padding: '2.5rem', borderLeft: '4px solid var(--primary)' }}>
          <h3 className="font-display" style={{ fontSize: '1.3rem', marginBottom: '1.2rem' }}>Implementation Example</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Our API is a drop-in replacement for OpenAI. Simply swap the URL and Key.</p>
          <pre style={{ background: 'rgba(0,0,0,0.5)', padding: '1.8rem', borderRadius: '16px', fontSize: '0.9rem', overflowX: 'auto', border: '1px solid var(--border)', color: '#d1d5db' }}>
{`// Install OpenAI SDK: npm install openai
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://deepbridge.sg/api/v1',
  apiKey: '${profile?.api_key || 'YOUR_KEY_HERE'}'
});

const chat = await openai.chat.completions.create({
  model: 'deepseek-chat',
  messages: [{ role: 'user', content: 'Hello!' }]
});`}
          </pre>
        </div>
      </div>
    </main>
  );
}
