import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lvojugyjspajdlrwevam.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2b2p1Z3lqc3BhamRscndldmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1OTQ4MDUsImV4cCI6MjA5MjE3MDgwNX0.-AXBNfJ7tcvoKYVNcDhyQ1lbiI1VO8ufvI2zX6w7wk4'

export const supabase = createClient(supabaseUrl, supabaseKey)