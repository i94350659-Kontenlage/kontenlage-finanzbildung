import pathlib

app_dir = pathlib.Path(r"G:\Scratch´nTravel\AusbauÜberlegungen\Website analysis and badge creation")

# 1. Write .env
env_content = """VITE_SUPABASE_URL=https://zaniqelfjpgdsgiogzcq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphbmlxZWxmanBnZHNnaW9nemNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNzE1NjksImV4cCI6MjA5MTg0NzU2OX0.2prtuyUuVB-f80iE5x2Zce4Gz_JF7iZSY8ifIXXnqlk
"""
(app_dir / ".env").write_text(env_content, encoding="utf-8")
print(".env created with live Supabase credentials!")

# 2. Update src/services/supabase.ts with direct fallback
supabase_ts = """import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://zaniqelfjpgdsgiogzcq.supabase.co'
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphbmlxZWxmanBnZHNnaW9nemNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNzE1NjksImV4cCI6MjA5MTg0NzU2OX0.2prtuyUuVB-f80iE5x2Zce4Gz_JF7iZSY8ifIXXnqlk'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
"""
(app_dir / "src" / "services" / "supabase.ts").write_text(supabase_ts, encoding="utf-8")
print("src/services/supabase.ts updated with live Supabase client!")
