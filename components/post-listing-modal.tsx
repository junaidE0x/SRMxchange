'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Sparkles, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { categories } from '@/lib/mock-data';
import type { CategoryId, ListingType } from '@/lib/mock-data';
import {
  BookOpen, Cpu, FileText, Ticket, Gift,
} from 'lucide-react';
import { createListing } from '@/lib/listings';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

const iconMap: Record<string, typeof BookOpen> = {
  BookOpen, Cpu, FileText, Sparkles, Ticket, Gift,
};

const types: { id: ListingType; label: string }[] = [
  { id: 'free', label: 'Free' },
  { id: 'exchange', label: 'Exchange' },
  { id: 'paid', label: 'Paid' },
];

export function PostListingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('books');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ListingType>('free');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [listingCount, setListingCount] = useState<number>(0);
  const MAX = 5;

  useEffect(() => {
    async function fetchCount() {
      const { user } = await getCurrentUser();
      if (!user) return;

      const { count } = await supabase
        .from('listings')
        .select('id', { count: 'exact', head: true })
        .eq('posted_by', user.id)
        .in('status', ['active', 'under_review']);

      setListingCount(count ?? 0);
    }
    if (open) {
      fetchCount();
    }
  }, [open]);
  
  // Image states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type and size
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      toast.error('Only JPEG, PNG and WebP images allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB.');
      return;
    }

    setImageFile(file);
    // Show preview immediately
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'rexchange_listings');
    
    // Request pre-generation of both sizes on upload
    /*formData.append(
      'eager',
      'w_800,h_600,c_fit,q_auto,f_auto|w_400,h_300,c_fit,q_auto,f_auto'
    );
    formData.append('eager_async', 'true');*/

    try {
      // Upload to Cloudinary 
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!res.ok) {
        console.error('Cloudinary upload failed:', res.status, res.statusText);
        return null;
      }
      
      const data = await res.json();
      const imageUrl = data.secure_url;

      // Run Google Vision moderation before returning URL
      const modRes = await fetch('/api/moderate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      });

      if (!modRes.ok) {
        console.error('Moderation API error:', modRes.status, modRes.statusText);
        toast.error('Image moderation service unavailable. Please try again.');
        return null;
      }

      const { safe, reason } = await modRes.json();

      if (!safe) {
        toast.error(reason ?? 'Image was flagged and cannot be uploaded.');
        return null; // block the listing
      }

      return imageUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsUploading(true);

    const { user } = await getCurrentUser();
    if (!user) {
      toast.error('You must be logged in to post.');
      setLoading(false);
      setIsUploading(false);
      return;
    }

    // Upload image to Cloudinary first if one was selected
    let imageUrl = null;
    if (imageFile) {
      const uploadResult = await uploadToCloudinary(imageFile);
      if (!uploadResult) {
        // Error already shown in uploadToCloudinary
        setLoading(false);
        setIsUploading(false);
        return;
      }
      imageUrl = uploadResult;
    }

    const { error, flagged } = await createListing({
      title,
      category,
      description,
      type,
      price: type === 'paid' ? price : undefined,
      postedBy: user.id,
      imageUrl, // pass the Cloudinary URL
    });

    if (flagged) {
      toast.error(error?.message || 'Your listing contains inappropriate content and cannot be posted.');
      setLoading(false);
      setIsUploading(false);
      return;
    }

    if (error) {
      toast.error(error.message || 'Failed to post listing.');
      setLoading(false);
      setIsUploading(false);
      return;
    }

    toast.success('Listing posted successfully!');

    // Reset form
    setLoading(false);
    setIsUploading(false);
    setTitle('');
    setDescription('');
    setPrice('');
    setType('free');
    removeImage();
    onClose();
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="glass-strong rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl rounded-t-2xl">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-400" />
                  Post a Listing
                </h2>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Calculus by Thomas — 3rd Sem"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="bg-white/[0.03] border-white/10 focus-visible:ring-violet-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((cat) => {
                      const Icon = iconMap[cat.icon];
                      const active = category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${
                            active
                              ? 'border-violet-500/50 bg-violet-500/10 shadow-[0_0_20px_-5px_rgba(124,58,237,0.4)]'
                              : 'border-white/[0.08] hover:border-white/20 bg-white/[0.02]'
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${active ? 'text-violet-400' : 'text-muted-foreground'}`} />
                          <span className={`text-[11px] font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {cat.label.split(' ')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the item, condition, pickup location on campus..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    className="bg-white/[0.03] border-white/10 focus-visible:ring-violet-500/50 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <div className="flex gap-2 p-1 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    {types.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setType(t.id)}
                        className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                          type === t.id
                            ? 'bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-lg shadow-violet-500/20'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {type === 'paid' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 pt-1">
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input
                          id="price"
                          type="number"
                          placeholder="e.g. 250"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="bg-white/[0.03] border-white/10 focus-visible:ring-violet-500/50"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Image Upload Section */}
                <div className="space-y-2">
                  <Label>Image (optional)</Label>
                  <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-violet-500/50 transition-colors overflow-hidden">
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage();
                          }}
                          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Upload className="h-6 w-6" />
                        <span className="text-sm">Click to upload image</span>
                        <span className="text-xs">JPEG, PNG, WebP · Max 5MB</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Listing slot indicator */}
                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span>Listings used</span>
                  <span className={listingCount >= MAX ? 'text-red-400' : 'text-violet-400'}>
                    {listingCount} / {MAX}
                  </span>
                </div>

                {/* Disable button if limit reached */}
                <Button
                  type="submit"
                  disabled={loading || isUploading || listingCount >= MAX}
                  className="w-full bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white rounded-xl py-2.5 transition-transform hover:scale-[1.02] shadow-lg shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {listingCount >= MAX 
                    ? `Limit reached (${MAX} max)` 
                    : isUploading ? 'Uploading & Moderating...' : loading ? 'Posting...' : 'Post Listing'
                  }
                </Button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}