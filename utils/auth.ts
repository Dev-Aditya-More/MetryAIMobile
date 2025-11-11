import { supabase } from './supabaseClient'

export const AuthService = {
  // Request password reset email
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://yourapp.com/reset-password', // your frontend redirect
    })
    return { data, error }
  },
}