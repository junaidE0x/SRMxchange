'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { toggleSaved } from '@/lib/listings';
import { DashboardShell } from '@/components/dashboard-shell';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { getDetailImage } from '@/lib/images';

export default function ListingDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!id) return;
      // Get current user
      const { user } = await getCurrentUser();
      if (user) {
        setCurrentUserId(user.id);
        // Check if listing is already saved
        const { data: savedRow } = await supabase
          .from('saved')
          .select('id')
          .eq('user_id', user.id)
          .eq('listing_id', id)
          .maybeSingle();
        if (savedRow) setIsSaved(true);
      }

      // Fetch listing with poster's profile
      const { data, error } = await supabase
        .from('listings')
        .select(`*, profiles(name, dept, year, reg_no)`)
        .eq('id', id)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }

      setListing(data);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleToggleSave = async () => {
    if (!currentUserId || !listing) {
      toast.error('Please log in to save listings.');
      return;
    }
    const { saved, error } = await toggleSaved(currentUserId, listing.id);
    if (error) {
      toast.error('Failed to update saved listing.');
      return;
    }
    setIsSaved(saved);
    toast.success(saved ? 'Listing saved!' : 'Removed from saved.');
  };

  const handleRequest = async () => {
    if (!currentUserId || !listing) return;
    setRequesting(true);

    const { error } = await supabase.from('requests').insert({
      listing_id: listing.id,
      from_user: currentUserId,
      to_user: listing.posted_by,
      status: 'pending',
    });

    if (error) {
      toast.error('Failed to send request.');
    } else {
      toast.success(`Request sent! ${listing.profiles?.name || 'Student'} will be notified.`);
    }
    setRequesting(false);
  };

  // Category gradient map
  const gradients: Record<string, string> = {
    books: 'from-violet-500 to-purple-600',
    Books: 'from-violet-500 to-purple-600',
    electronics: 'from-blue-500 to-cyan-500',
    Electronics: 'from-blue-500 to-cyan-500',
    notes: 'from-amber-500 to-orange-500',
    Notes: 'from-amber-500 to-orange-500',
    skills: 'from-green-500 to-teal-500',
    Skills: 'from-green-500 to-teal-500',
    tickets: 'from-pink-500 to-rose-500',
    Tickets: 'from-pink-500 to-rose-500',
    giveaways: 'from-indigo-500 to-violet-500',
    Giveaways: 'from-indigo-500 to-violet-500',
  };

  if (loading) {
    return (
      <DashboardShell activeNav="browse">
        <p className="text-muted-foreground">Loading...</p>
      </DashboardShell>
    );
  }

  if (!listing) {
    return (
      <DashboardShell activeNav="browse">
        <p className="text-muted-foreground">Listing not found.</p>
        <Link href="/dashboard">
          <Button variant="outline" className="mt-4">Back to Browse</Button>
        </Link>
      </DashboardShell>
    );
  }

  const poster = listing.profiles;
  const gradient = gradients[listing.category] ?? 'from-violet-500 to-cyan-500';
  const isOwner = currentUserId === listing.posted_by;

  return (
    <DashboardShell activeNav="browse">
      {/* Top bar with Back button and Save action */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <button
          onClick={handleToggleSave}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all btn-press ${
            isSaved
              ? 'border-violet-500/50 bg-violet-500/20 text-violet-300 shadow-[0_0_15px_-3px_rgba(124,58,237,0.3)]'
              : 'border-white/10 glass text-muted-foreground hover:text-foreground'
          }`}
        >
          <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-violet-400 text-violet-400' : ''}`} />
          {isSaved ? 'Saved' : 'Save'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image / category visual */}
        <div className="rounded-2xl overflow-hidden">
          {listing.image_url ? (
            <img
              src={(listing.image_url)}
              alt={listing.title}
              className="w-full h-auto object-contain rounded-2xl"
            />
          ) : (
            <div className={`w-full h-64 bg-gradient-to-br ${gradient} flex items-center justify-center rounded-2xl`}>
              <span className="text-8xl font-black text-white/20">
                {listing.title?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          {/* Category + type badges */}
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
              {listing.category}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-muted-foreground border border-white/10 capitalize">
              {listing.type}
            </span>
            {listing.status === 'under_review' && (
              <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Under Review
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold">{listing.title}</h1>

          {/* Price */}
          {listing.type === 'paid' && listing.price && (
            <p className="text-2xl font-semibold text-violet-400">₹{listing.price}</p>
          )}
          {listing.type === 'free' && (
            <p className="text-2xl font-semibold text-green-400">Free</p>
          )}
          {listing.type === 'exchange' && (
            <p className="text-2xl font-semibold text-cyan-400">Exchange</p>
          )}

          {/* Description */}
          {listing.description && (
            <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
          )}

          {/* Posted by */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold">
              {poster?.name?.charAt(0) ?? '?'}
            </div>
            <div>
              <p className="font-medium">{poster?.name ?? 'Unknown'}</p>
              <p className="text-xs text-muted-foreground">
                {poster?.dept} · {poster?.year}yr · Verified SRM Student ✓
              </p>
            </div>
          </div>

          {/* CTA */}
          {!isOwner && (
            <Button
              onClick={handleRequest}
              disabled={requesting}
              className="w-full bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white rounded-xl py-3 shadow-lg shadow-violet-500/20 transition-transform hover:scale-[1.02]"
            >
              {requesting ? 'Sending...' : 'Request to Connect'}
            </Button>
          )}

          {isOwner && (
            <p className="text-sm text-muted-foreground text-center">This is your listing.</p>
          )}

          <p className="text-xs text-muted-foreground">
            Posted {listing.created_at ? new Date(listing.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'recently'}
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
