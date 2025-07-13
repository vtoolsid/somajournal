# Supabase Setup Instructions

## 1. Create Database Tables

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/schema.sql` 
4. Click **Run** to execute the SQL

This will create:
- `users` table with proper columns
- Row Level Security (RLS) policies 
- Indexes for performance
- Updated timestamp triggers

## 2. Configure Clerk-Supabase Integration

### In Clerk Dashboard:
1. Go to **Integrations** → **Supabase**
2. Click **Configure**
3. Add your Supabase Project URL: `https://idionamupbxukuoitduz.supabase.co`
4. Click **Activate Supabase Integration**

This creates the JWT template that allows Clerk tokens to work with Supabase.1

### In Supabase Dashboard:
1. Go to **Authentication** → **Providers**
2. Scroll down to **Third-party providers**
3. Click **Add provider** → **Clerk**
4. Add your Clerk domain: `gorgeous-dassie-98.clerk.accounts.dev`

## 3. Verify Setup

After completing the integration:

1. Restart your Next.js development server
2. Sign in with Clerk authentication
3. Check browser console for successful Supabase sync messages
4. Go to Supabase **Table Editor** → **users** to see your user data

## 4. Troubleshooting

**If you see "No JWT template exists with name: supabase":**
- Complete step 2 (Clerk-Supabase integration)
- Make sure both Clerk and Supabase sides are configured

**If you see RLS policy errors:**
- Make sure you ran the SQL schema from step 1
- The RLS policies allow users to access only their own data

**If data isn't syncing:**
- Check that your environment variables match your actual Supabase project
- Verify the Clerk domain is correct in Supabase settings

## Current Status

✅ Environment variables configured  
✅ Database schema ready to deploy  
✅ Error handling for missing JWT template  
⏳ Waiting for Clerk-Supabase integration setup  

Once you complete the Clerk-Supabase integration in the dashboards, the full authentication flow will work seamlessly!