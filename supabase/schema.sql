-- Create users table for SomaJournal
CREATE TABLE public.users (
    id text PRIMARY KEY, -- Clerk user ID
    email text NOT NULL,
    full_name text NOT NULL,
    assessment_completed boolean DEFAULT false,
    assessment_progress jsonb DEFAULT '{}',
    assessment_data jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for Clerk integration
-- Users can only access their own data
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT TO authenticated
    USING (auth.jwt() ->> 'sub' = id);

CREATE POLICY "Users can insert their own data" ON public.users
    FOR INSERT TO authenticated
    WITH CHECK (auth.jwt() ->> 'sub' = id);

CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE TO authenticated
    USING (auth.jwt() ->> 'sub' = id)
    WITH CHECK (auth.jwt() ->> 'sub' = id);

-- Create index for better performance
CREATE INDEX idx_users_email ON public.users (email);
CREATE INDEX idx_users_assessment_completed ON public.users (assessment_completed);

-- Grant permissions
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;