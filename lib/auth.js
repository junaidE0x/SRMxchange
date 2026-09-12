// lib/auth.js
// Auth helper functions — signup, login, logout, get current user
import { supabase } from './supabase'

// Signup — only allows @srmist.edu.in emails
export async function signUp({ email, password, name, regNo, dept, year }) {
  // Block non-SRM emails before even hitting Supabase
  if (!email.endsWith('@srmist.edu.in')) {
    return { error: { message: 'Only @srmist.edu.in email addresses are allowed.' } }
  }

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) return { error: authError }

  // Insert profile data linked to the auth user
  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    email,
    name,
    reg_no: regNo,
    dept,
    year: parseInt(year),
  })

  if (profileError) return { error: profileError }

  return { user: authData.user }
}

// Login
export async function signIn({ email, password }) {
  if (!email.endsWith('@srmist.edu.in')) {
    return { error: { message: 'Only @srmist.edu.in email addresses are allowed.' } }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return { error }
  return { user: data.user, session: data.session }
}

// Logout
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Public profile — safe to show anyone
export async function getPublicProfile(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('id, name, dept, year')
    .eq('id', userId)
    .single()
  return data
}

// Private profile — only for the logged-in user themselves
export async function getPrivateProfile(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return data
}

// Get current logged-in user + their profile
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, profile: null }

  const profile = await getPrivateProfile(user.id)

  return { user, profile }
}