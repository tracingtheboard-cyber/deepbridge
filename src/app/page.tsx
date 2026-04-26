import { ArrowRight, Zap, Globe, Shield, Menu } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      {/* Background Decor */}
      <div className="bg-grid"></div>
      <div className="glow-orb" style={{ top: '-100px', right: '-100px' }}></div>
      <div className="glow-orb" style={{ bottom: '10%', left: '-100px', opacity: 0.1 }}></div>

      {/* Navigation */}
      <nav className="nav">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <div className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            Deep<span className="text-gradient">Bridge</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            <Link href="#pricing" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>Pricing</Link>
            <Link href="#features" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>Features</Link>
            <Link href="#docs" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>API Docs</Link>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '0.6rem 1.4rem' }}>Console</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ paddingTop: '180px', paddingBottom: '80px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="animate-fade" style={{ marginBottom: '2.5rem' }}>
            <span style={{ 
              background: 'rgba(56, 189, 248, 0.1)', 
              color: 'var(--primary)', 
              padding: '0.6rem 1.2rem', 
              borderRadius: '99px',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: '1px solid var(--border)'
            }}>
              🇸🇬 DeepBridge Singapore Node is Live
            </span>
          </div>
          
          <h1 className="font-display animate-fade" style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', lineHeight: 1.1, marginBottom: '1.8rem', fontWeight: 800 }}>
            The Global Gateway to <br />
            <span className="text-gradient">Hyper-Efficient AI</span>
          </h1>
          
          <p className="animate-fade" style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 3.5rem auto', lineHeight: 1.6 }}>
            Access elite-tier models like DeepSeek-V3 via our high-speed Singapore relay. 
            Full OpenAI compatibility. Pay in USD. Save up to 98% on API costs.
          </p>
          
          <div className="flex-center animate-fade" style={{ gap: '1.5rem' }}>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.1rem', padding: '1rem 2.2rem' }}>
                Get Free Credits <ArrowRight size={20} />
              </button>
            </Link>
            <button style={{ 
              background: 'transparent', 
              color: 'white', 
              padding: '1rem 2.2rem', 
              borderRadius: '12px', 
              border: '1px solid var(--border)',
              fontWeight: 600,
              fontSize: '1.1rem',
              cursor: 'pointer'
            }}>
              API Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section id="pricing" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="glass animate-fade" style={{ padding: '4rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <h2 className="font-display" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Arbitrage the Token Gap</h2>
              <p style={{ color: 'var(--text-muted)' }}>Same quality, fraction of the price. Seamless integration.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>GPT-4o / Claude 3.5</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>$15.00</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Per 1M Combined Tokens</div>
              </div>
              
              <div style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(56, 189, 248, 0.05)', border: '1px solid var(--primary)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-12px', right: '20px', background: 'var(--primary)', color: 'white', padding: '2px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>98% CHEAPER</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--primary)', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>DeepBridge (V3)</div>
                <div className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>$0.30</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Per 1M Combined Tokens</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem' }}>
            <div className="animate-fade">
              <div className="flex-center" style={{ width: '56px', height: '56px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid var(--glow)', borderRadius: '16px', marginBottom: '1.5rem' }}>
                <Zap color="var(--primary)" size={28} />
              </div>
              <h3 className="font-display" style={{ fontSize: '1.5rem', marginBottom: '1.2rem' }}>Edge Performance</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>Deployed on Singapore Edge Runtime. Minimal overhead between global users and domestic sources.</p>
            </div>
            
            <div className="animate-fade">
              <div className="flex-center" style={{ width: '56px', height: '56px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid var(--glow)', borderRadius: '16px', marginBottom: '1.5rem' }}>
                <Globe color="var(--primary)" size={28} />
              </div>
              <h3 className="font-display" style={{ fontSize: '1.5rem', marginBottom: '1.2rem' }}>Stripe Ready</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>Fully compliant Singapore entity. Top up with USD via Stripe and get instant credit for your API usage.</p>
            </div>
            
            <div className="animate-fade">
              <div className="flex-center" style={{ width: '56px', height: '56px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid var(--glow)', borderRadius: '16px', marginBottom: '1.5rem' }}>
                <Shield color="var(--primary)" size={28} />
              </div>
              <h3 className="font-display" style={{ fontSize: '1.5rem', marginBottom: '1.2rem' }}>Privacy First</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>We don't log your prompts. Our relay is a transparent pass-through layer designed for speed and trust.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '80px 0 40px 0', borderTop: '1px solid var(--border)', marginTop: '80px' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="font-display" style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>DeepBridge</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>The Singapore Node for Global AI Compute.</p>
          </div>
          <div style={{ display: 'flex', gap: '3rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Product</span>
              <Link href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Pricing</Link>
              <Link href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>API</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Legal</span>
              <Link href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Privacy</Link>
              <Link href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Terms</Link>
            </div>
          </div>
        </div>
        <div className="container" style={{ marginTop: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>
          © 2026 DeepBridge SG. Powered by Next.js Edge.
        </div>
      </footer>
    </main>
  );
}
