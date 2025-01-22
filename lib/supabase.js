import { AppState } from 'react-native'
// import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

// import {SUPABASE_KEY, SUPABASE_URL} from '@env'

// const supabaseUrl = SUPABASE_URL
// const supabaseAnonKey = SUPABASE_KEY
const supabaseUrl = 'https://eyyeyoztqsxehwjleeam.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5eWV5b3p0cXN4ZWh3amxlZWFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDUxNTM1MywiZXhwIjoyMDUwMDkxMzUzfQ.mboNi4Os48RvbmGQh9yIUH1b1oTaODQTR10hxxnjhe0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})