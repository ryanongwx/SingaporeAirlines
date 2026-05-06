import { useEffect, useRef, useState } from 'react'
import { Concierge } from './components/Concierge'
import { AudioPill } from './components/AudioPill'

const displayFont = { fontFamily: "'Instrument Serif', serif" }

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

function TopBar() {
  return (
    <div className="relative z-20 border-b border-white/5 bg-black/20 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Singapore (SGD)</span>
          <span className="opacity-40">•</span>
          <a href="#" className="hover:text-foreground">English</a>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-foreground">KrisFlyer Sign In</a>
          <span className="opacity-40">•</span>
          <a href="#" className="hover:text-foreground">Join Now</a>
          <span className="opacity-40">•</span>
          <a href="#" className="hover:text-foreground">Help</a>
        </div>
      </div>
    </div>
  )
}

function Nav() {
  return (
    <nav className="relative z-10 mx-auto flex max-w-7xl flex-row items-center justify-between px-8 py-6">
      <a href="#" className="text-3xl tracking-tight text-foreground" style={displayFont}>
        Singapore Airlines<sup className="text-xs">®</sup>
      </a>
      <ul className="hidden items-center gap-8 md:flex">
        <li><a href="#" className="text-sm text-foreground transition-colors">Home</a></li>
        <li><a href="#book" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Plan & Book</a></li>
        <li><a href="#experience" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Experience</a></li>
        <li><a href="#destinations" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Where We Fly</a></li>
        <li><a href="#krisflyer" className="text-sm text-muted-foreground transition-colors hover:text-foreground">KrisFlyer</a></li>
      </ul>
      <button
        type="button"
        className="liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground hover:scale-[1.03]"
      >
        Begin Journey
      </button>
    </nav>
  )
}

type BookingTab = 'book' | 'manage' | 'checkin' | 'status'

function BookingWidget() {
  const [tab, setTab] = useState<BookingTab>('book')
  const tabs: { id: BookingTab; label: string }[] = [
    { id: 'book', label: 'Book Flight' },
    { id: 'manage', label: 'Manage Booking' },
    { id: 'checkin', label: 'Check-In' },
    { id: 'status', label: 'Flight Status' },
  ]

  return (
    <div className="liquid-glass mx-auto w-full max-w-5xl rounded-3xl p-2">
      <div className="flex flex-wrap gap-1 border-b border-white/10 px-2 pt-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative rounded-t-xl px-5 py-3 text-sm transition-colors ${
              tab === t.id
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
            {tab === t.id && (
              <span className="absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            )}
          </button>
        ))}
      </div>

      <div className="p-6">
        {tab === 'book' && <BookForm />}
        {tab === 'manage' && (
          <SimpleForm
            fields={[
              { label: 'Booking Reference', placeholder: '6 characters' },
              { label: 'Last Name', placeholder: 'Surname' },
            ]}
            cta="Retrieve Booking"
          />
        )}
        {tab === 'checkin' && (
          <SimpleForm
            fields={[
              { label: 'Booking Reference / E-Ticket', placeholder: 'Reference' },
              { label: 'Last Name', placeholder: 'Surname' },
            ]}
            cta="Check In"
          />
        )}
        {tab === 'status' && (
          <SimpleForm
            fields={[
              { label: 'Flight Number', placeholder: 'e.g. SQ322' },
              { label: 'Date', placeholder: 'DD / MM / YYYY', type: 'date' },
            ]}
            cta="Check Status"
          />
        )}
      </div>
    </div>
  )
}

function BookForm() {
  const [trip, setTrip] = useState<'round' | 'oneway' | 'multi'>('round')
  const [cabin, setCabin] = useState('Economy')
  const [pax, setPax] = useState(1)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-6 text-sm">
        {(['round', 'oneway', 'multi'] as const).map((t) => (
          <label key={t} className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="trip"
              checked={trip === t}
              onChange={() => setTrip(t)}
              className="accent-white"
            />
            <span className={trip === t ? 'text-foreground' : 'text-muted-foreground'}>
              {t === 'round' ? 'Round Trip' : t === 'oneway' ? 'One Way' : 'Multi-City'}
            </span>
          </label>
        ))}
        <div className="ml-auto flex items-center gap-3">
          <select
            aria-label="Cabin class"
            value={cabin}
            onChange={(e) => setCabin(e.target.value)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground outline-none"
          >
            <option>Economy</option>
            <option>Premium Economy</option>
            <option>Business</option>
            <option>First / Suites</option>
          </select>
          <select
            aria-label="Passenger count"
            value={pax}
            onChange={(e) => setPax(Number(e.target.value))}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground outline-none"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} Passenger{n > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Field label="From" placeholder="Singapore (SIN)" />
        <Field label="To" placeholder="Tokyo (HND)" />
        <Field label="Departure" placeholder="DD / MM / YYYY" type="date" />
        <Field
          label="Return"
          placeholder="DD / MM / YYYY"
          type="date"
          disabled={trip === 'oneway'}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field label="Promo Code" placeholder="Optional" />
        <label className="flex items-center gap-2 self-end pb-3 text-sm text-muted-foreground">
          <input type="checkbox" className="accent-white" /> Redeem with KrisFlyer miles
        </label>
        <label className="flex items-center gap-2 self-end pb-3 text-sm text-muted-foreground">
          <input type="checkbox" className="accent-white" /> Flexible dates
        </label>
      </div>

      <div className="flex justify-end pt-2">
        <button className="liquid-glass cursor-pointer rounded-full px-10 py-3.5 text-sm text-foreground hover:scale-[1.03]">
          Search Flights
        </button>
      </div>
    </div>
  )
}

function Field({
  label,
  placeholder,
  type = 'text',
  disabled,
}: {
  label: string
  placeholder: string
  type?: string
  disabled?: boolean
}) {
  return (
    <label className={`block ${disabled ? 'opacity-40' : ''}`}>
      <span className="mb-1.5 block text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-white/30"
      />
    </label>
  )
}

function SimpleForm({
  fields,
  cta,
}: {
  fields: { label: string; placeholder: string; type?: string }[]
  cta: string
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((f) => (
          <Field key={f.label} {...f} />
        ))}
      </div>
      <div className="flex justify-end">
        <button className="liquid-glass cursor-pointer rounded-full px-10 py-3.5 text-sm text-foreground hover:scale-[1.03]">
          {cta}
        </button>
      </div>
    </div>
  )
}

function Marquee({ words }: { words: string[] }) {
  const line = words.join('   ·   ')
  return (
    <div className="relative z-10 overflow-hidden border-y border-white/5 py-10">
      <div className="marquee-track flex whitespace-nowrap">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="px-6 text-[3rem] leading-none text-foreground/80 md:text-[5rem]"
            style={{ ...displayFont, letterSpacing: '-0.04em' }}
          >
            {line}   ·{' '}
          </span>
        ))}
      </div>
    </div>
  )
}

function ParallaxStrip({
  image,
  eyebrow,
  title,
  em,
  copy,
  slug,
}: {
  image: string
  eyebrow: string
  title: string
  em: string
  copy: string
  slug?: string
}) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section
      className="parallax-bg relative z-10 min-h-[80vh] w-full"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
      <div className="relative mx-auto flex min-h-[80vh] max-w-7xl items-center px-8 py-32">
        <div ref={ref} className="reveal max-w-xl">
          <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <span>{eyebrow}</span>
            {slug && <AudioPill src={`/audio/${slug}.mp3`} label={eyebrow} />}
          </div>
          <h2
            className="mb-6 text-4xl leading-[1.05] sm:text-5xl md:text-6xl"
            style={displayFont}
          >
            {title}{' '}
            <em className="not-italic text-muted-foreground">{em}</em>
          </h2>
          <p className="mb-8 text-base leading-relaxed text-muted-foreground">
            {copy}
          </p>
          <button
            type="button"
            className="liquid-glass cursor-pointer rounded-full px-8 py-3 text-sm hover:scale-[1.03]"
          >
            Discover
          </button>
        </div>
      </div>
    </section>
  )
}

function CountUp({ to, suffix = '', duration = 1800 }: { to: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const start = performance.now()
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - p, 3)
            setVal(Math.floor(eased * to))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          io.unobserve(e.target)
        })
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [to, duration])
  const formatted =
    to >= 1_000_000
      ? `${(val / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
      : to >= 1000
      ? val.toLocaleString()
      : String(val)
  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  )
}

function SectionHeader({ eyebrow, title, em }: { eyebrow: string; title: string; em?: string }) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className="reveal mb-12 max-w-3xl">
      <div className="mb-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
        {eyebrow}
      </div>
      <h2
        className="text-4xl font-normal leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
        style={displayFont}
      >
        {title}{' '}
        {em && <em className="not-italic text-muted-foreground">{em}</em>}
      </h2>
    </div>
  )
}

function Promotions() {
  const items = [
    {
      tag: 'Limited Time',
      title: 'Spring Fares to Europe',
      copy: 'Round-trip from Singapore to Paris, London, and Zurich starting from SGD 1,288.',
    },
    {
      tag: 'New Route',
      title: 'Singapore — Brussels',
      copy: 'Discover Belgium with daily non-stop service in our newly refreshed cabins.',
    },
    {
      tag: 'KrisFlyer',
      title: 'Double Miles to Japan',
      copy: 'Earn 2× KrisFlyer miles on flights to Tokyo, Osaka, and Sapporo through June.',
    },
  ]
  const ref = useReveal<HTMLDivElement>()
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-8 py-32">
      <SectionHeader
        eyebrow="Featured Offers"
        title="Fares crafted for the"
        em="curious traveller."
      />
      <div ref={ref} className="reveal grid gap-6 md:grid-cols-3">
        {items.map((p) => (
          <article
            key={p.title}
            className="liquid-glass group flex flex-col rounded-3xl p-8 transition-transform hover:-translate-y-1"
          >
            <div className="mb-6 inline-flex w-fit rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">
              {p.tag}
            </div>
            <h3 className="mb-3 text-2xl leading-tight" style={displayFont}>
              {p.title}
            </h3>
            <p className="mb-8 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>
            <a
              href="#"
              className="mt-auto inline-flex items-center gap-2 text-sm text-foreground"
            >
              Explore offer
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}

function Destinations() {
  const dests = [
    {
      slug: 'tokyo',
      name: 'Tokyo',
      code: 'HND',
      from: 'SGD 698',
      duration: '7h 10m',
      freq: 'Daily',
      image:
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1400&q=80',
    },
    {
      slug: 'paris',
      name: 'Paris',
      code: 'CDG',
      from: 'SGD 1,288',
      duration: '13h 45m',
      freq: '12× weekly',
      image:
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80',
    },
    {
      slug: 'new-york',
      name: 'New York',
      code: 'JFK',
      from: 'SGD 1,888',
      duration: '18h 50m',
      freq: 'Daily',
      image:
        'https://images.unsplash.com/photo-1496588152823-86ff7695e68f?auto=format&fit=crop&w=1400&q=80',
    },
    {
      slug: 'sydney',
      name: 'Sydney',
      code: 'SYD',
      from: 'SGD 788',
      duration: '8h 05m',
      freq: '3× daily',
      image:
        'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1400&q=80',
    },
    {
      slug: 'london',
      name: 'London',
      code: 'LHR',
      from: 'SGD 1,388',
      duration: '13h 30m',
      freq: '4× daily',
      image:
        'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1400&q=80',
    },
    {
      slug: 'zurich',
      name: 'Zurich',
      code: 'ZRH',
      from: 'SGD 1,488',
      duration: '12h 55m',
      freq: '5× weekly',
      image:
        'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?auto=format&fit=crop&w=1400&q=80',
    },
  ]
  const ref = useReveal<HTMLDivElement>()
  const [feature, ...rest] = dests
  return (
    <section
      id="destinations"
      className="relative z-10 mx-auto max-w-7xl px-8 py-32"
    >
      <SectionHeader
        eyebrow="Where We Fly"
        title="Over 130 destinations,"
        em="one boundless sky."
      />
      <div
        ref={ref}
        className="reveal grid gap-4 lg:grid-cols-3 lg:grid-rows-2"
      >
        <a
          href="#"
          className="group relative col-span-1 row-span-2 overflow-hidden rounded-3xl lg:col-span-2"
          style={{
            backgroundImage: `url(${feature.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '480px',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent transition-opacity group-hover:opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
          <div className="absolute left-0 top-0 flex items-center gap-2 p-6">
            <span className="liquid-glass rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] text-foreground">
              Featured Route
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-8">
            <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              SIN → {feature.code} · {feature.duration} · {feature.freq}
            </div>
            <div
              className="mb-3 text-5xl leading-none md:text-6xl"
              style={displayFont}
            >
              {feature.name}
            </div>
            <div className="flex items-end justify-between">
              <div className="text-sm text-muted-foreground">
                Round-trip from{' '}
                <span className="text-foreground">{feature.from}</span>
              </div>
              <span className="liquid-glass rounded-full px-5 py-2 text-xs text-foreground transition-transform group-hover:translate-x-1">
                Explore →
              </span>
            </div>
          </div>
        </a>

        {rest.map((d) => (
          <a
            key={d.code}
            href="#"
            className="group relative overflow-hidden rounded-3xl"
            style={{
              backgroundImage: `url(${d.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '232px',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10 transition-all group-hover:from-background/95" />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <div className="mb-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {d.code} · {d.duration}
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl leading-none" style={displayFont}>
                    {d.name}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    From{' '}
                    <span className="text-foreground">{d.from}</span>
                  </div>
                </div>
                <span className="text-xl text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-foreground">
                  →
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs uppercase tracking-[0.25em] text-muted-foreground">
        <span>Showing 6 of 130+ destinations</span>
        <a href="#" className="text-foreground hover:opacity-80">
          View all routes →
        </a>
      </div>
    </section>
  )
}

function Experience() {
  const cabins = [
    {
      name: 'Suites',
      copy: 'A private sanctuary above the clouds — sliding doors, a separate bed and chair, and intimate dining for two.',
    },
    {
      name: 'Business',
      copy: 'Full-flat beds, direct aisle access, and a curated Book the Cook menu of regional signatures.',
    },
    {
      name: 'Premium Economy',
      copy: 'A wider seat, dedicated cabin, and elevated dining to make every long-haul gentler.',
    },
    {
      name: 'Economy',
      copy: 'Award-winning service, generous legroom, and a world of entertainment on KrisWorld.',
    },
  ]
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="experience" className="relative z-10 mx-auto max-w-7xl px-8 py-32">
      <SectionHeader
        eyebrow="The Onboard Experience"
        title="Four cabins."
        em="One signature of service."
      />
      <div ref={ref} className="reveal grid gap-6 md:grid-cols-2">
        {cabins.map((c, i) => (
          <article
            key={c.name}
            className="liquid-glass flex flex-col gap-3 rounded-3xl p-8"
          >
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              0{i + 1}
            </div>
            <h3 className="text-3xl" style={displayFont}>
              {c.name}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{c.copy}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function KrisFlyer() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="krisflyer" className="relative z-10 mx-auto max-w-7xl px-8 py-32">
      <div
        ref={ref}
        className="reveal liquid-glass grid items-center gap-10 rounded-[2.5rem] p-12 md:grid-cols-2"
      >
        <div>
          <div className="mb-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            KrisFlyer
          </div>
          <h2 className="mb-6 text-4xl leading-tight md:text-5xl" style={displayFont}>
            Every mile, a step{' '}
            <em className="not-italic text-muted-foreground">closer to the next horizon.</em>
          </h2>
          <p className="mb-8 max-w-md text-sm leading-relaxed text-muted-foreground">
            Earn miles on flights, dining, and shopping. Redeem them for award flights,
            cabin upgrades, and curated experiences across our partners.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="liquid-glass rounded-full px-7 py-3 text-sm hover:scale-[1.03]">
              Join KrisFlyer
            </button>
            <button className="rounded-full border border-white/15 px-7 py-3 text-sm text-muted-foreground hover:text-foreground">
              Sign In
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { node: <CountUp to={14_000_000} suffix="+" />, l: 'Members' },
            { node: <CountUp to={130} suffix="+" />, l: 'Destinations' },
            { node: <CountUp to={25} suffix="+" />, l: 'Partners' },
            { node: <>2×</>, l: 'Bonus Miles' },
            { node: <CountUp to={4} />, l: 'Cabin Classes' },
            { node: <>24/7</>, l: 'Concierge' },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
            >
              <div className="text-2xl" style={displayFont}>
                {s.node}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TravelInfo() {
  const links = [
    'Baggage Allowance',
    'Travel Documents',
    'Special Assistance',
    'Pets & Animals',
    'Health & Safety',
    'Travelling with Children',
    'Airport Information',
    'Flight Disruptions',
  ]
  const ref = useReveal<HTMLDivElement>()
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-8 py-32">
      <SectionHeader
        eyebrow="Before You Fly"
        title="Travel information,"
        em="simplified."
      />
      <div ref={ref} className="reveal grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((l) => (
          <a
            key={l}
            href="#"
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 text-sm text-muted-foreground transition-colors hover:border-white/30 hover:text-foreground"
          >
            {l}
            <span className="opacity-50 transition-transform group-hover:translate-x-1">→</span>
          </a>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  const cols = [
    {
      h: 'Plan & Book',
      links: ['Book a Flight', 'Manage Booking', 'Check-In', 'Flight Status', 'Travel Deals'],
    },
    {
      h: 'Experience',
      links: ['Cabins', 'Dining', 'Entertainment', 'Wi-Fi', 'Lounges'],
    },
    {
      h: 'KrisFlyer',
      links: ['Join', 'Earn Miles', 'Redeem Miles', 'PPS Club', 'Partners'],
    },
    {
      h: 'Help',
      links: ['Contact Us', 'Refunds', 'Feedback', 'Travel Advisory', 'FAQs'],
    },
  ]
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-8 py-20">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-1">
            <div className="text-3xl" style={displayFont}>
              Singapore Airlines<sup className="text-xs">®</sup>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Crafted in the sky since 1947.
            </p>
            <div className="mt-6 flex gap-3">
              {['IG', 'FB', 'X', 'YT'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-[10px] text-muted-foreground hover:text-foreground"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <div className="mb-4 text-xs uppercase tracking-[0.25em] text-foreground">
                {c.h}
              </div>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-muted-foreground md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} Singapore Airlines Limited. All rights reserved.</div>
          <div className="flex flex-wrap gap-5">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Cookies</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function App() {
  return (
    <main className="relative w-full bg-background text-foreground">
      <section className="relative h-screen w-full overflow-hidden">
        <video
          className="absolute inset-0 z-0 h-full w-full object-cover"
          src="/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/40 via-black/20 to-background/80" />

        <Nav />

        <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-16 pb-20 text-center">
          <h1
            className="animate-fade-rise max-w-7xl text-5xl font-normal leading-[0.95] sm:text-7xl md:text-8xl"
            style={{ ...displayFont, letterSpacing: '-2.46px' }}
          >
            Where <em className="not-italic text-muted-foreground">dreams</em> rise{' '}
            <em className="not-italic text-muted-foreground">through the silence.</em>
          </h1>
          <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            We're crafting journeys for restless minds and curious hearts. Search fares,
            manage your trip, and step into the cabin reimagined.
          </p>
        </div>
      </section>

      <section id="book" className="relative z-10 mx-auto -mt-32 max-w-7xl px-6 pb-20">
        <BookingWidget />
      </section>

      <ParallaxStrip
        image="https://images.unsplash.com/photo-1538970272646-f61fabb3a8a2?auto=format&fit=crop&w=2000&q=80"
        eyebrow="Bali · DPS"
        title="Where the morning"
        em="breathes in slow motion."
        copy="Five daily flights to the Island of the Gods. Awaken to terraced rice fields and temples carved into volcanic stone."
        slug="bali"
      />

      <Promotions />

      <Marquee
        words={[
          'Crafted in the sky',
          'Since 1947',
          'A great way to fly',
          'Beyond the horizon',
        ]}
      />

      <ParallaxStrip
        image="https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=2000&q=80"
        eyebrow="Tokyo · HND"
        title="Where neon dusk"
        em="meets ancient calm."
        copy="Daily non-stop service from Singapore in our newly refreshed cabins. Wake to Mount Fuji on the descent."
        slug="tokyo"
      />

      <Destinations />

      <ParallaxStrip
        image="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=80"
        eyebrow="Paris · CDG"
        title="A city composed"
        em="in golden hour."
        copy="Twelve weekly flights to the City of Light, with seamless connections to over thirty European capitals."
        slug="paris"
      />

      <Experience />

      <ParallaxStrip
        image="https://images.unsplash.com/photo-1496588152823-86ff7695e68f?auto=format&fit=crop&w=2000&q=80"
        eyebrow="New York · JFK"
        title="A skyline rewritten"
        em="every single night."
        copy="Daily non-stop service across the Pacific. Step off in Manhattan ready for the boardroom or Broadway."
        slug="new-york"
      />

      <KrisFlyer />

      <ParallaxStrip
        image="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=2000&q=80"
        eyebrow="Sydney · SYD"
        title="Sun-soaked harbours"
        em="and salt-bright air."
        copy="Three flights a day to the Harbour City — a perfect overnight from Singapore, arriving fresh for breakfast at Bondi."
        slug="sydney"
      />

      <TravelInfo />
      <Footer />
      <Concierge />
    </main>
  )
}

export default App
