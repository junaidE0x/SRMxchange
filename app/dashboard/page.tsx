'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth';
import { getListings } from '@/lib/listings';
import { supabase } from '@/lib/supabase';
import type { CategoryId } from '@/lib/mock-data';
import { ListingCard } from '@/components/listing-card';
import { PostListingModal } from '@/components/post-listing-modal';
import { DashboardShell } from '@/components/dashboard-shell';
import { PageTransition } from '@/components/page-transition';

const filterChips: { id: 'all' | CategoryId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'books', label: 'Books' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'notes', label: 'Notes' },
  { id: 'skills', label: 'Skills' },
  { id: 'tickets', label: 'Tickets' },
  { id: 'giveaways', label: 'Giveaways' },
];

function RippleChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const idRef = useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = idRef.current++;
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`relative overflow-hidden px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap btn-press transition-all ${active
          ? 'bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-lg shadow-violet-500/20'
          : 'glass text-muted-foreground hover:text-foreground hover:border-white/20'
        }`}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
          style={{ left: r.x - 10, top: r.y - 10, width: 20, height: 20 }}
        />
      ))}
      {label}
    </button>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  async function loadListings(category: string) {
    const { data, error } = await getListings(category);
    if (!error && data) setListings(data);
  }

  async function loadSavedIds(userId: string) {
    try {
      const { data, error } = await supabase
        .from('saved')
        .select('listing_id')
        .eq('user_id', userId);
      if (!error && data) {
        setSavedIds(new Set(data.map((row: any) => String(row.listing_id))));
      }
    } catch (e) {
      console.error('Error loading saved IDs:', e);
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        const { user, profile } = await getCurrentUser();

        // If no session, redirect to login
        if (!user) {
          router.push('/login');
          return;
        }

        setProfile(profile);
        await Promise.all([
          loadListings(activeCategory),
          loadSavedIds(user.id)
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    loadListings(catId);
  };

  const filtered = listings.filter((l) => {
    const studentName = l.student?.name || l.profiles?.name || '';
    const searchMatch =
      !search ||
      l.title?.toLowerCase().includes(search.toLowerCase()) ||
      studentName.toLowerCase().includes(search.toLowerCase());
    return searchMatch;
  });

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    if (hour < 21) return 'Good evening'
    return 'Good night'
  }

  return (
    <PageTransition>
      <DashboardShell activeNav="browse" search={search} onSearchChange={setSearch}>
        {/* Welcome banner — animated gradient */}
        <div className="relative rounded-2xl p-6 mb-6 overflow-hidden">
          <div
            className="absolute inset-0 animate-gradient-shift opacity-90"
            style={{
              background: 'linear-gradient(120deg, rgba(124,58,237,0.2) 0%, rgba(99,102,241,0.15) 30%, rgba(6,182,212,0.15) 60%, rgba(124,58,237,0.2) 100%)',
            }}
          />
          <div className="absolute inset-0 glass" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                {new Date().getHours() < 21 
                  ? <Sun className="h-4 w-4 text-amber-400" /> 
                  : <Moon className="h-4 w-4 text-blue-400" />
                }
                {getGreeting()}
              </p>
              <h1 className="text-2xl font-bold mt-1">
                {profile?.name ?? 'Loading...'} <span className="text-muted-foreground text-lg font-normal">👋</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {profile?.dept} · {profile?.year}{['st','nd','rd'][profile?.year - 1] ?? 'th'} Year · {profile?.reg_no}
              </p>
            </div>
            <Button
              onClick={() => setModalOpen(true)}
              className="btn-press bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white rounded-xl shadow-lg shadow-violet-500/20 transition-transform hover:scale-105 shrink-0"
            >
              <Plus className="h-4 w-4 mr-1.5" /> Post a Listing
            </Button>
          </div>
        </div>

        {/* Filter chips with ripple */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
          {filterChips.map((chip) => (
            <RippleChip
              key={chip.id}
              active={activeCategory === chip.id}
              onClick={() => handleCategoryClick(chip.id)}
              label={chip.label}
            />
          ))}
        </div>

        {/* Listings grid with stagger exit/enter */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeCategory}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
            >
              {filtered.map((listing, i) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  index={i}
                  isSaved={savedIds.has(String(listing.id))}
                  onSaveToggle={(saved) => {
                    setSavedIds((prev) => {
                      const next = new Set(prev);
                      if (saved) next.add(String(listing.id));
                      else next.delete(String(listing.id));
                      return next;
                    });
                  }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No listings found for this filter.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAB */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          onClick={() => setModalOpen(true)}
          className="fixed bottom-20 md:bottom-8 right-6 md:right-8 z-30 h-14 w-14 rounded-full bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center shadow-2xl shadow-violet-500/40 hover:scale-110 btn-press transition-transform"
        >
          <Plus className="h-6 w-6 text-white" />
        </motion.button>

        <PostListingModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </DashboardShell>
    </PageTransition>
  );
}
