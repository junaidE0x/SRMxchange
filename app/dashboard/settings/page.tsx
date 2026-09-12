'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { DashboardShell } from '@/components/dashboard-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { User, Shield, Eye, EyeOff } from 'lucide-react'

/*const DEPARTMENTS = ['CSE', 'ECE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML', 'EEE']*/
/*const YEARS = ['1', '2', '3', '4']*/

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [form, setForm] = useState({
    name: '',
    dept: '',
    year: '',
    phone: '',
    show_phone: false,
    show_email: false,
    show_reg_no: false,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const { profile } = await getCurrentUser()
      if (profile) {
        setProfile(profile)
        setForm({
          name: profile.name ?? '',
          dept: profile.dept ?? '',
          year: profile.year ? String(profile.year) : '',
          phone: profile.phone ?? '',
          show_phone: Boolean(profile.show_phone),
          show_email: Boolean(profile.show_email),
          show_reg_no: Boolean(profile.show_reg_no),
        })
      }
    }
    load()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        name: form.name,
        dept: form.dept,
        year: parseInt(form.year),
        phone: form.phone,
        show_phone: form.show_phone,
        show_email: form.show_email,
        show_reg_no: form.show_reg_no,
      })
      .eq('id', profile.id)

    if (error) {
      toast.error('Failed to save changes.')
    } else {
      toast.success('Profile updated!')
    }
    setLoading(false)
  }

  return (
    <DashboardShell activeNav="settings">
      <h2 className="text-xl font-bold mb-2">Settings</h2>
      <p className="text-muted-foreground text-sm mb-8">
        Manage your profile and privacy preferences
      </p>

      <div className="max-w-lg space-y-6">

        {/* Profile Section */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <User className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold">Profile</h3>
              <p className="text-xs text-muted-foreground">
                Your public information
              </p>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label>Display Name</Label>
            <Input
              value={profile?.name ?? ''}
              disabled
              /*onChange={e => setForm(p => ({ ...p, name: e.target.value }))}*/
              className="bg-white/[0.03] border-white/10 focus-visible:ring-violet-500/50"
            />
          </div>

          {/* Dept + Year */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Department</Label>
              <Input
                value={profile?.dept ?? ''}
                disabled
                /*onChange={e => setForm(p => ({ ...p, dept: e.target.value }))}*/
                className="w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              >
              </Input>
            </div>
            <div className="space-y-2">
              <Label>Year</Label>
              <Input
                value={profile?.year ?? ''}
                disabled
                /*onChange={e => setForm(p => ({ ...p, year: e.target.value }))}*/
                className="w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              >
              </Input>
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label>WhatsApp Number</Label>
            <Input
              value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              placeholder="+91 98765 43210"
              className="bg-white/[0.03] border-white/10 focus-visible:ring-violet-500/50"
            />
            <p className="text-xs text-muted-foreground">
              Used for contact after a request is accepted.
              Only shared based on your privacy settings below.
            </p>
          </div>

          {/* Reg No — read only */}
          <div className="space-y-2">
            <Label>Registration Number</Label>
            <Input
              value={profile?.reg_no ?? ''}
              disabled
              className="bg-white/[0.03] border-white/10 opacity-50 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Cannot be changed.
            </p>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Shield className="h-4 w-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold">Privacy</h3>
              <p className="text-xs text-muted-foreground">
                Control what others see about you
              </p>
            </div>
          </div>

          {/* Toggle helper component inline */}
          {[
            {
              key: 'show_phone',
              label: 'Show WhatsApp number',
              description: 'Visible to students whose requests you accept'
            },
            {
              key: 'show_email',
              label: 'Show SRM email',
              description: 'Visible on your listing detail page'
            },
            {
              key: 'show_reg_no',
              label: 'Show registration number',
              description: 'Visible on your public profile'
            },
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              <button
                onClick={() => setForm(p => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  form[key as keyof typeof form]
                    ? 'bg-violet-600'
                    : 'bg-white/10'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  form[key as keyof typeof form]
                    ? 'translate-x-6'
                    : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}

          <p className="text-xs text-muted-foreground pt-2 border-t border-white/10">
            Your contact details are never shared publicly.
            They are only revealed to the other party
            after both sides agree to connect.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white rounded-xl py-3 shadow-lg shadow-violet-500/20"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </DashboardShell>
  )
}