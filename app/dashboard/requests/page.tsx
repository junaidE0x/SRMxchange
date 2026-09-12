'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { DashboardShell } from '@/components/dashboard-shell';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectedUser, setConnectedUser] = useState<any>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    async function load() {
      const { user } = await getCurrentUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          listings(title, category),
          profiles!requests_from_user_fkey(
            name, dept, year, email, phone,
            show_phone, show_email, show_reg_no
          )
        `)
        .eq('to_user', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) setRequests(data);
      setLoading(false);
    }
    load();
  }, []);

  const updateStatus = async (id: string, status: 'accepted' | 'declined') => {
    const { error } = await supabase
      .from('requests')
      .update({ status })
      .eq('id', id);

    if (!error) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );

      if (status === 'accepted') {
        // Find the request to get requester details
        const req = requests.find((r) => r.id === id);
        setConnectedUser(req?.profiles);
        setShowContactModal(true); // show contact details
      } else {
        toast.success('Request declined.');
      }
    }
  };

  return (
    <DashboardShell activeNav="requests">
      <h2 className="text-xl font-bold mb-6">Requests</h2>
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-muted-foreground">No requests yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="p-4 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{req.profiles?.name ?? 'Unknown'}</p>
                <p className="text-xs text-muted-foreground">
                  {req.profiles?.dept} · {req.profiles?.year}yr
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Wants: <span className="text-foreground">{req.listings?.title}</span>
                </p>
              </div>
              {req.status === 'pending' ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => updateStatus(req.id, 'accepted')}
                    className="bg-green-600 hover:bg-green-500 text-white"
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(req.id, 'declined')}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    Decline
                  </Button>
                </div>
              ) : (
                <span className={`text-xs px-3 py-1 rounded-full capitalize ${
                  req.status === 'accepted' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {req.status}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Contact Reveal Modal */}
      {showContactModal && connectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-strong rounded-3xl p-8 max-w-sm w-full space-y-5">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {connectedUser.name?.charAt(0)}
              </div>
              <h3 className="text-xl font-bold">You're connected!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Share contact details to complete the exchange
              </p>
            </div>

            <div className="space-y-3 p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <p className="text-sm font-medium">{connectedUser.name}</p>
              <p className="text-xs text-muted-foreground">
                {connectedUser.dept} · Year {connectedUser.year}
              </p>

              {/* Only show what they've made public in privacy settings */}
              {connectedUser.show_phone && connectedUser.phone && (
                <a
                  href={`https://wa.me/${connectedUser.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300"
                >
                  WhatsApp: {connectedUser.phone}
                </a>
              )}
              {connectedUser.show_email && (
                <p className="text-sm text-violet-400">{connectedUser.email}</p>
              )}
              {!connectedUser.show_phone && !connectedUser.show_email && (
                <p className="text-xs text-muted-foreground italic">
                  This student hasn't shared contact details yet.
                  Reach out through SRM channels.
                </p>
              )}
            </div>

            <Button
              onClick={() => setShowContactModal(false)}
              className="w-full bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-xl"
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
