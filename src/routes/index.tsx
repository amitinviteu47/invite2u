import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/')({
  component: WeddingInvitation,
})

const AUDIO_SRC =
  'https://www.dropbox.com/scl/fi/odoaftp7lnci979b25969/ReelAudio-14813.mp3?rlkey=tk7qj7f4kb26ge8vf45ofbaiu&st=zsdz1q64&dl=1'

const WEDDING_DATE = new Date('2026-06-19T17:55:00')

const EVENTS = [
  { name: 'Haldi', date: '5 July', icon: '🌼', desc: 'Marigold blessings ' },
  { name: 'Mehndi', date: '5 July', icon: '🌿', desc: 'Henna & florals' },
  { name: 'Jal Nimantran', date: '5 July', icon: '💧', desc: 'Sacred cleansing' },
  {
    name: 'Satyanarayan Katha',
    date: '6 July',
    icon: '🪔',
    desc: 'Divine prayers',
  },
  {
    name: 'Ghritdhari',
    date: '6 July',
    icon: '🔥',
    desc: 'Sacred fire ritual',
  },
  { name: 'Varmala', date: '6 July', icon: '💐', desc: 'Garland exchange' },
  {
    name: 'Wedding Night',
    date: '6 July',
    icon: '💍',
    desc: 'Union of souls',
  },
]

function Petal({
  style,
}: {
  style: React.CSSProperties & { '--delay': string; '--duration': string }
}) {
  return <div className="petal" style={style} />
}

function FloatingPetals({ count = 18 }: { count?: number }) {
  const petals = Array.from({ length: count }, (_, i) => ({
    left: `${(i * 100) / count + Math.random() * 5}%`,
    '--delay': `${(i * 0.7) % 8}s`,
    '--duration': `${6 + (i % 5)}s`,
    opacity: 0.5 + Math.random() * 0.4,
    fontSize: `${14 + (i % 4) * 4}px`,
  }))
  return (
    <div className="petals-container" aria-hidden="true">
      {petals.map((style, i) => (
        <Petal key={i} style={style as any} />
      ))}
    </div>
  )
}

function useCountdown(target: Date) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    function tick() {
     const targetTime = target.getTime()
      const currentTime = Date.now()
      
      // Calculate absolute difference in milliseconds
      const diff = Math.abs(targetTime - currentTime)

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTime({ days, hours, minutes, seconds })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])
  return time
}

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed')
          }
        })
      },
      { threshold: 0.12 },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

export default function WeddingInvitation() {
  const [entered, setEntered] = useState(false)
  const [muted, setMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const countdown = useCountdown(WEDDING_DATE)
  useScrollReveal()

  function handleEnter() {
    setEntered(true)
    const audio = audioRef.current
    if (audio) {
      audio.volume = 0
      audio.play().catch(() => {})
      let vol = 0
      const step = 0.03
      const interval = setInterval(() => {
        vol = Math.min(vol + step, 0.6)
        audio.volume = vol
        if (vol >= 0.6) clearInterval(interval)
      }, 100)
    }
  }

  function toggleMute() {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setMuted(audio.muted)
  }

  return (
    <>
      <audio ref={audioRef} id="bgMusic" loop>
        <source src={AUDIO_SRC} type="audio/mpeg" />
      </audio>

      {/* Audio Gate Overlay */}
      {!entered && (
        <div className="overlay">
          <FloatingPetals count={24} />
          <div className="overlay-content">
            <div className="overlay-floral" aria-hidden="true">✦ ✿ ✦</div>
            <h1 className="overlay-names">Payal &amp; Ravi</h1>
            <p className="overlay-tagline">
              <em>
                "Two hearts, one destiny — a celebration awaits."
              </em>
            </p>
            <button className="btn-gold" onClick={handleEnter}>
              Enter &amp; Celebrate
            </button>
          </div>
        </div>
      )}

      {/* Sticky Audio Button */}
      {entered && (
        <button
          className="audio-btn"
          onClick={toggleMute}
          aria-label={muted ? 'Unmute music' : 'Mute music'}
        >
          {muted ? (
            <span className="audio-icon muted">♪</span>
          ) : (
            <span className="audio-icon">
              <span className="wave" />
              <span className="wave" />
              <span className="wave" />
            </span>
          )}
        </button>
      )}

      <main className={`site-main${entered ? ' visible' : ''}`}>
        {/* HERO */}
        <section className="hero">
          <FloatingPetals count={20} />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="floral-accent top-accent" aria-hidden="true">
              ❧ ✿ ❧
            </div>
            <p className="hero-eyebrow">— Wedding Invitation —</p>
            <h1 className="hero-names">Payal &amp; Ravi</h1>
            <div className="gold-divider" aria-hidden="true">⟡ ✦ ⟡</div>
            <p className="hero-subtitle">
              Together is a beautiful place to be — join us as we begin forever.
            </p>
            <a href="#story" className="btn-gold">
              Celebrate With Us
            </a>
            <div className="floral-accent bottom-accent" aria-hidden="true">
              ❧ ✿ ❧
            </div>
          </div>
        </section>

        {/* STORY / INVITE */}
        <section id="story" className="section section-story">
          <div className="floral-divider reveal" aria-hidden="true">
            ✿ ❀ ✿ ❀ ✿ ❀ ✿
          </div>
          <div className="section-inner reveal">
            <p className="eyebrow">With Joy &amp; Blessings</p>
            <h2 className="section-title">You Are Invited</h2>
            <blockquote className="invite-message">
              With hearts full of joy and blessings from our families, we
              joyfully invite you to witness and bless the sacred union of Payal
              and Ravi. Your presence will make our celebration complete and fill
              this beautiful moment with even more love.
            </blockquote>
          </div>
          <div className="floral-divider reveal" aria-hidden="true">
            ✿ ❀ ✿ ❀ ✿ ❀ ✿
          </div>
        </section>

        {/* COUNTDOWN */}
        <section className="section section-countdown">
          <div className="section-inner reveal">
            <p className="eyebrow gold-eyebrow">Mark Your Calendar</p>
            <h2 className="section-title light-title">
              The Big Day Is Almost Here
            </h2>
            <div className="countdown-grid">
              {(
                [
                  ['days', 'Days'],
                  ['hours', 'Hours'],
                  ['minutes', 'Minutes'],
                  ['seconds', 'Seconds'],
                ] as const
              ).map(([key, label]) => (
                <div className="countdown-card" key={key}>
                  <span className="countdown-num">
                    {String(countdown[key]).padStart(2, '0')}
                  </span>
                  <span className="countdown-label">{label}</span>
                </div>
              ))}
            </div>
            <p className="countdown-date">6 July 2026</p>
          </div>
        </section>

        {/* EVENTS */}
        <section className="section section-events">
          <div className="section-inner">
            <p className="eyebrow reveal">A Week of Celebrations</p>
            <h2 className="section-title reveal">Wedding Functions</h2>
            <div className="events-grid">
              {EVENTS.map((ev, i) => (
                <div
                  className="event-card reveal"
                  key={ev.name}
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <div className="event-icon">{ev.icon}</div>
                  <h3 className="event-name">{ev.name}</h3>
                  <p className="event-date">{ev.date}</p>
                  <p className="event-desc">{ev.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VENUE */}
        <section className="section section-venue">
          <div className="section-inner reveal">
            <p className="eyebrow">The Celebration Venue</p>
            <h2 className="section-title venue-title">Biswanath Sadan</h2>
            <p className="venue-address">
              Kendua Chowk, Bishanpur Road, Sahibganj, Jharkhand 816110
            </p>
            <div className="map-wrapper">
              <iframe
                src="https://www.google.com/maps?q=24.8182619,87.7411770&z=15&output=embed"
                className="map-iframe"
                title="Venue Map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="map-marker" aria-hidden="true">
                <span className="map-dot" />
              </div>
              <div className="map-popup">
                <p className="map-popup-name">Biswanath Sadan</p>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=24.8182619,87.7411770"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-directions"
                >
                  Get Directions
                </a>
              </div>
            </div>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=24.8182619,87.7411770"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold mt-6 inline-block"
            >
              Get Directions
            </a>
          </div>
        </section>

        {/* CONTACT */}
        <section className="section section-contact">
          <div className="section-inner reveal">
            <p className="eyebrow">Need Help?</p>
            <h2 className="section-title">Guest Support</h2>
            <div className="contact-card">
              <p className="host-name">Radheshyam Pandit</p>
              <p className="coordinator-names">Amit Kumar &amp; Sumit Kumar</p>
              <p className="coordinator-label">Brother of the Bride</p>
              <div className="contact-buttons">
                <a href="tel:+917645069609" className="contact-btn btn-phone">
                  <span className="btn-icon">📞</span>
                  <span>Call</span>
                </a>
                <a
                  href="https://wa.me/917645069609?text=Hi%20Amit%2C%20I'm%20a%20guest%20for%20the%20wedding%20on%20April%2029%20and%20had%20a%20quick%20question."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-btn btn-whatsapp"
                >
                  <span className="btn-icon">💬</span>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CLOSING */}
        <section className="section section-closing">
          <FloatingPetals count={16} />
          <div className="closing-overlay" />
          <div className="section-inner reveal closing-inner">
            <div className="floral-border" aria-hidden="true">
              ✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿
            </div>
            <h2 className="closing-title">Payal &amp; Ravi</h2>
            <p className="closing-message">
              Thank you for being a part of our story. Your love and blessings
              mean the world to us — we cannot wait to celebrate with you!
            </p>
            <button
              className="btn-gold"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Join Us in Celebration
            </button>
            <div className="floral-border" aria-hidden="true">
              ✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿
            </div>
            <p className="closing-date">6 July 2026</p>
          </div>
        </section>
      </main>
    </>
  )
}
