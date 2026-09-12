'use client';

import Link from 'next/link';
import { motion, useInView, animate } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import {
  BookOpen, Cpu, FileText, Sparkles, Ticket, Gift,
  ArrowRight, Search, Users, Package, Layers,
  Zap, Handshake, MessageCircle, GraduationCap,
} from 'lucide-react';
import { categories } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { BackgroundBeams } from '@/components/background-beams';
import { TiltCard } from '@/components/tilt-card';
import { supabase } from '@/lib/supabase';

const iconMap: Record<string, typeof BookOpen> = {
  BookOpen, Cpu, FileText, Sparkles, Ticket, Gift,
};

const stats = [
  { label: 'Students', value: 2000, suffix: '+', icon: Users },
  { label: 'Active Listings', value: 500, suffix: '+', icon: Package },
  { label: 'Categories', value: 6, suffix: '', icon: Layers },
];

const steps = [
  { icon: Zap, title: 'Post', desc: 'List your book, notes, electronics, or skills in under 60 seconds.' },
  { icon: Search, title: 'Discover', desc: 'Browse listings filtered by category, department, and price.' },
  { icon: MessageCircle, title: 'Connect', desc: 'Send a request and coordinate pickup right on campus.' },
];

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.floor(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref}>{display}{suffix}</span>
  );
}

function FloatingCard({ children, delay, className }: { children: React.ReactNode; delay: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute ${className}`}
    >
      <TiltCard maxTilt={15}>
        <div className="animate-float" style={{ animationDelay: `${delay}s` }}>
          {children}
        </div>
      </TiltCard>
    </motion.div>
  );
}

export default function Home() {
  const [counts, setCounts] = useState<Record<string, number>>({
    books: 0,
    electronics: 0,
    notes: 0,
    skills: 0,
    tickets: 0,
    giveaways: 0,
  });
  const [dbStats, setDbStats] = useState<{ students: number; listings: number } | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const { data: listingsData } = await supabase
          .from('listings')
          .select('category');

        const { count: studentCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (listingsData) {
          const newCounts: Record<string, number> = {
            books: 0,
            electronics: 0,
            notes: 0,
            skills: 0,
            tickets: 0,
            giveaways: 0,
          };
          listingsData.forEach((row: any) => {
            if (row.category && row.category in newCounts) {
              newCounts[row.category]++;
            }
          });
          setCounts(newCounts);
          setDbStats({
            students: studentCount || 0,
            listings: listingsData.length,
          });
        }
      } catch (err) {
        console.error('Error loading stats:', err);
      }
    }
    loadStats();
  }, []);

  const dynamicStats = [
    { label: 'Students', value: dbStats?.students ?? 8, suffix: (dbStats?.students ?? 8) > 8 ? '+' : '', icon: Users },
    { label: 'Active Listings', value: dbStats?.listings ?? 12, suffix: (dbStats?.listings ?? 12) > 12 ? '+' : '', icon: Package },
    { label: 'Categories', value: 6, suffix: '', icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">
      {/* Global dot grid background */}
      <div className="fixed inset-0 dot-grid pointer-events-none opacity-60" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/60 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">SRMxchange</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#browse" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Browse</Link>
            <Link href="/#how" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it Works</Link>
            <Link href="/#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
          </div>
          <Link href="/login">
            <Button className="btn-press bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white rounded-full px-5 shadow-lg shadow-violet-500/20 transition-transform hover:scale-105">
              Login with SRM
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24 md:pt-32 md:pb-40">
        <BackgroundBeams />

        {/* Floating cards background */}
        <FloatingCard delay={0.3} className="top-16 left-[8%] hidden lg:block">
          <div className="glass-strong rounded-2xl p-4 w-56 shadow-2xl">
            <div className="h-20 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 mb-3 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white/80" />
            </div>
            <p className="text-sm font-medium text-foreground">Calculus by Thomas</p>
            <p className="text-xs text-muted-foreground mt-1">Exchange · 3rd sem CSE</p>
          </div>
        </FloatingCard>

        <FloatingCard delay={0.6} className="top-32 right-[6%] hidden lg:block">
          <div className="glass-strong rounded-2xl p-4 w-56 shadow-2xl">
            <div className="h-20 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 mb-3 flex items-center justify-center">
              <Cpu className="h-8 w-8 text-white/80" />
            </div>
            <p className="text-sm font-medium text-foreground">Arduino Uno Kit</p>
            <p className="text-xs text-muted-foreground mt-1">₹850 · 2nd year ECE</p>
          </div>
        </FloatingCard>

        <FloatingCard delay={0.9} className="bottom-0 left-[15%] hidden lg:block">
          <div className="glass-strong rounded-2xl p-4 w-52 shadow-2xl">
            <div className="h-20 rounded-lg bg-gradient-to-br from-pink-600 to-rose-700 mb-3 flex items-center justify-center">
              <Ticket className="h-8 w-8 text-white/80" />
            </div>
            <p className="text-sm font-medium text-foreground">Riviera Day 2 Pass</p>
            <p className="text-xs text-muted-foreground mt-1">₹300 · 4th year IT</p>
          </div>
        </FloatingCard>

        <div className="relative text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-muted-foreground">Now live for SRM Kattankulathur</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]"
          >
            <span className="text-foreground">Exchange Smarter.</span>
            <br />
            <span className="gradient-text">Study Better.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
          >
            The student-only marketplace for SRM KTR. Buy, sell, and exchange books, notes, electronics, and more — all within your campus community.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link href="/login">
              <Button size="lg" className="btn-press bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white rounded-full px-8 shadow-xl shadow-violet-500/25 transition-transform hover:scale-105 group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="btn-press rounded-full px-8 glass border-white/10 hover:bg-white/5 transition-transform hover:scale-105">
                Browse Listings
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="relative border-y border-white/[0.06] bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-3 gap-4">
          {dynamicStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <stat.icon className="h-5 w-5 text-violet-400 mx-auto mb-2" />
              <p className="text-2xl sm:text-4xl font-extrabold gradient-text">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="browse" className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">Browse by <span className="gradient-text-cyan">Category</span></h2>
          <p className="mt-3 text-muted-foreground">Find exactly what you need across six campus categories</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon];
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link href="/dashboard">
                  <div
                    className="group glass card-shimmer rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 8px 40px -8px ${cat.glowColor}`;
                      e.currentTarget.style.borderColor = cat.glowColor.replace('0.35', '0.5');
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '';
                      e.currentTarget.style.borderColor = '';
                    }}
                  >
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg">{cat.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{counts[cat.id] ?? 0} listings</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">How <span className="gradient-text-cyan">SRMxchange</span> Works</h2>
          <p className="mt-3 text-muted-foreground">Three simple steps from listing to connecting</p>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-violet-500/50 via-cyan-500/50 to-violet-500/50 origin-left"
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="relative inline-flex h-16 w-16 rounded-2xl glass-strong items-center justify-center mb-4 mx-auto z-10">
                <step.icon className="h-7 w-7 text-violet-400" />
                <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-bold text-lg">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section id="about" className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative glass-strong rounded-3xl p-12 text-center overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(124,58,237,0.4) 0%, transparent 70%)' }} />
          <div className="relative">
            <Handshake className="h-10 w-10 text-violet-400 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold">Ready to join the exchange?</h2>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">Connect with thousands of SRM KTR students exchanging resources every day.</p>
            <Link href="/login">
              <Button size="lg" className="btn-press mt-6 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white rounded-full px-8 shadow-xl shadow-violet-500/25 transition-transform hover:scale-105">
                Login with SRM
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold gradient-text">SRMxchange</span>
              <p className="text-xs text-muted-foreground">Exchange smarter, study better.</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Built for SRM Kattankulathur</p>
        </div>
      </footer>
    </div>
  );
}
