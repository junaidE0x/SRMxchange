'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap, Search, LayoutGrid, Package,
  Inbox, Bookmark, Settings, ChevronDown, User, LogOut,
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { NotificationBell } from '@/components/notification-bell';
import { getCurrentUser, signOut } from '@/lib/auth';

const navItems = [
  { id: 'browse', label: 'Browse', icon: LayoutGrid, href: '/dashboard' },
  { id: 'listings', label: 'My Listings', icon: Package, href: '/dashboard/my-listings' },
  { id: 'requests', label: 'Requests', icon: Inbox, href: '/dashboard/requests' },
  { id: 'saved', label: 'Saved', icon: Bookmark, href: '/dashboard/saved' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

interface DashboardShellProps {
  children: ReactNode;
  activeNav: string;
  search?: string;
  onSearchChange?: (v: string) => void;
}

export function DashboardShell({ children, activeNav, search, onSearchChange }: DashboardShellProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      const { profile } = await getCurrentUser();
      setProfile(profile);
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const getInitials = (name?: string) => {
    if (!name) return '..';
    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-white/[0.06]">
        <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text hidden sm:block">SRMxchange</span>
          </Link>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search listings, students..."
              value={search ?? ''}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/30 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <NotificationBell />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full glass px-2 py-1.5 hover:border-white/20 transition-all shrink-0 btn-press">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
                    {getInitials(profile?.name)}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{profile?.name?.split(' ')[0] ?? '...'}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 glass-strong border-white/10">
                <DropdownMenuLabel className="text-muted-foreground text-xs">{profile?.name ?? '...'}</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/[0.06]" />
                <Link href="/dashboard/settings">
                  <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">
                    <User className="h-4 w-4 mr-2" /> Profile
                  </DropdownMenuItem>
                </Link>
                <Link href="/dashboard/my-listings">
                  <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">
                    <Package className="h-4 w-4 mr-2" /> My Listings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator className="bg-white/[0.06]" />
                <DropdownMenuItem onClick={handleLogout} className="hover:bg-white/5 cursor-pointer text-red-400">
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar — desktop with glassmorphism */}
        <aside className="hidden md:flex w-60 shrink-0 glass-sidebar border-r border-white/[0.06] p-4 flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all btn-press ${
                activeNav === item.id
                  ? 'bg-gradient-to-r from-violet-600/20 to-violet-500/5 text-foreground border border-violet-500/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              <item.icon className={`h-4 w-4 ${activeNav === item.id ? 'text-violet-400' : ''}`} />
              {item.label}
            </Link>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-6 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Bottom nav — mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 glass-strong border-t border-white/[0.08] backdrop-blur-xl">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                activeNav === item.id ? 'text-violet-400' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
