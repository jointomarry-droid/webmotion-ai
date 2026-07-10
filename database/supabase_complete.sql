-- ============================================
-- WebMotion.ai - Complete Supabase SQL
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================

-- 1. ENABLE EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url VARCHAR(500),
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'pro', 'team', 'enterprise')),
    ai_credits INTEGER DEFAULT 100 NOT NULL,
    lifetime_deal BOOLEAN DEFAULT FALSE NOT NULL,
    stripe_customer_id VARCHAR(255) UNIQUE,
    stripe_subscription_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. TEMPLATES TABLE
-- ============================================
CREATE TABLE public.templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('hero', 'landing', 'component', 'animation', 'page', 'section', 'ecommerce', 'dashboard', 'blog', 'portfolio')),
    subcategory VARCHAR(100),
    prompt_content TEXT NOT NULL,
    code_output TEXT,
    framework VARCHAR(20) DEFAULT 'framer-motion' CHECK (framework IN ('framer-motion', 'gsap', 'css', 'three-js', 'react-spring', 'lenis')),
    preview_image VARCHAR(500),
    preview_video VARCHAR(500),
    tags TEXT[] DEFAULT '{}',
    is_premium BOOLEAN DEFAULT FALSE NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0 NOT NULL,
    downloads INTEGER DEFAULT 0 NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 0 NOT NULL,
    rating_count INTEGER DEFAULT 0 NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'archived')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. TEMPLATE REVIEWS
-- ============================================
CREATE TABLE public.template_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES public.templates(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(template_id, user_id)
);

-- 5. PROJECTS TABLE
-- ============================================
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_id UUID REFERENCES public.templates(id) ON DELETE SET NULL,
    generated_code TEXT,
    deployment_url VARCHAR(500),
    deployment_status VARCHAR(20) DEFAULT 'draft' CHECK (deployment_status IN ('draft', 'building', 'deployed', 'failed', 'cancelled')),
    github_repo_url VARCHAR(500),
    vercel_project_id VARCHAR(255),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 6. DEPLOYMENTS TABLE
-- ============================================
CREATE TABLE public.deployments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    provider VARCHAR(20) NOT NULL CHECK (provider IN ('vercel', 'netlify', 'github-pages', 'custom')),
    repository_url VARCHAR(500),
    deployment_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'building', 'deploying', 'success', 'failed', 'cancelled')),
    logs TEXT,
    commit_sha VARCHAR(40),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 7. AI CHATS TABLE
-- ============================================
CREATE TABLE public.ai_chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title VARCHAR(255) DEFAULT 'New Chat',
    messages JSONB DEFAULT '[]',
    model_used VARCHAR(50) NOT NULL CHECK (model_used IN ('gpt-4', 'gpt-4-turbo', 'claude-3-opus', 'claude-3-sonnet', 'gemini-pro', 'deepseek')),
    tokens_input INTEGER DEFAULT 0 NOT NULL,
    tokens_output INTEGER DEFAULT 0 NOT NULL,
    cost_usd DECIMAL(10, 6) DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 8. TRANSACTIONS TABLE
-- ============================================
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('subscription', 'one-time', 'refund', 'credit-purchase', 'template-purchase')),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    stripe_payment_id VARCHAR(255),
    stripe_invoice_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded', 'cancelled')),
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 9. FAVORITES TABLE
-- ============================================
CREATE TABLE public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    template_id UUID REFERENCES public.templates(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(user_id, template_id)
);

-- 10. AI USAGE TRACKING
-- ============================================
CREATE TABLE public.ai_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    action VARCHAR(50) NOT NULL CHECK (action IN ('generate', 'chat', 'transform', 'optimize', 'export')),
    model_used VARCHAR(50) NOT NULL,
    tokens_used INTEGER DEFAULT 0 NOT NULL,
    cost_usd DECIMAL(10, 6) DEFAULT 0 NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 11. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(30) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN DEFAULT FALSE NOT NULL,
    link VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_stripe_customer ON public.profiles(stripe_customer_id);
CREATE INDEX idx_templates_category ON public.templates(category);
CREATE INDEX idx_templates_creator ON public.templates(creator_id);
CREATE INDEX idx_templates_status ON public.templates(status);
CREATE INDEX idx_templates_framework ON public.templates(framework);
CREATE INDEX idx_templates_tags ON public.templates USING GIN(tags);
CREATE INDEX idx_template_reviews_template ON public.template_reviews(template_id);
CREATE INDEX idx_projects_user ON public.projects(user_id);
CREATE INDEX idx_projects_template ON public.projects(template_id);
CREATE INDEX idx_deployments_project ON public.deployments(project_id);
CREATE INDEX idx_ai_chats_user ON public.ai_chats(user_id);
CREATE INDEX idx_ai_chats_project ON public.ai_chats(project_id);
CREATE INDEX idx_transactions_user ON public.transactions(user_id);
CREATE INDEX idx_transactions_stripe ON public.transactions(stripe_payment_id);
CREATE INDEX idx_favorites_user ON public.favorites(user_id);
CREATE INDEX idx_favorites_template ON public.favorites(template_id);
CREATE INDEX idx_ai_usage_user ON public.ai_usage(user_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deployments_updated_at BEFORE UPDATE ON public.deployments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Calculate average rating after review insert/update/delete
CREATE OR REPLACE FUNCTION public.update_template_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.templates
    SET 
        rating = COALESCE((SELECT AVG(rating)::DECIMAL(3,2) FROM public.template_reviews WHERE template_id = COALESCE(NEW.template_id, OLD.template_id)), 0),
        rating_count = (SELECT COUNT(*) FROM public.template_reviews WHERE template_id = COALESCE(NEW.template_id, OLD.template_id))
    WHERE id = COALESCE(NEW.template_id, OLD.template_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_change
    AFTER INSERT OR UPDATE OR DELETE ON public.template_reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_template_rating();

-- Increment template downloads
CREATE OR REPLACE FUNCTION public.increment_template_downloads(template_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.templates
    SET downloads = downloads + 1
    WHERE id = template_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Deduct AI credits
CREATE OR REPLACE FUNCTION public.deduct_ai_credits(user_uuid UUID, amount INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    current_credits INTEGER;
BEGIN
    SELECT ai_credits INTO current_credits FROM public.profiles WHERE id = user_uuid;
    
    IF current_credits >= amount THEN
        UPDATE public.profiles
        SET ai_credits = ai_credits - amount
        WHERE id = user_uuid;
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Templates: Anyone can read approved, only creator can modify
CREATE POLICY "Anyone can view approved templates" ON public.templates
    FOR SELECT USING (status = 'approved' OR creator_id = auth.uid());

CREATE POLICY "Users can create templates" ON public.templates
    FOR INSERT WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update own templates" ON public.templates
    FOR UPDATE USING (creator_id = auth.uid());

CREATE POLICY "Users can delete own templates" ON public.templates
    FOR DELETE USING (creator_id = auth.uid());

-- Reviews: Anyone can read, only authenticated users can create
CREATE POLICY "Anyone can view reviews" ON public.template_reviews
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON public.template_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON public.template_reviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON public.template_reviews
    FOR DELETE USING (auth.uid() = user_id);

-- Projects: Users can CRUD their own projects
CREATE POLICY "Users can view own projects" ON public.projects
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create projects" ON public.projects
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own projects" ON public.projects
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own projects" ON public.projects
    FOR DELETE USING (user_id = auth.uid());

-- Deployments: Users can view own project deployments
CREATE POLICY "Users can view own deployments" ON public.deployments
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid())
    );

CREATE POLICY "Users can create deployments" ON public.deployments
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid())
    );

-- AI Chats: Users can view own chats
CREATE POLICY "Users can view own chats" ON public.ai_chats
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create chats" ON public.ai_chats
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Transactions: Users can view own transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (user_id = auth.uid());

-- Favorites: Users can manage own favorites
CREATE POLICY "Users can view own favorites" ON public.favorites
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can add favorites" ON public.favorites
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove favorites" ON public.favorites
    FOR DELETE USING (user_id = auth.uid());

-- AI Usage: Users can view own usage
CREATE POLICY "Users can view own usage" ON public.ai_usage
    FOR SELECT USING (user_id = auth.uid());

-- Notifications: Users can view own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can mark notifications read" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

-- ============================================
-- STORAGE BUCKETS
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
    ('templates', 'templates', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4']),
    ('projects', 'projects', false, 52428800, ARRAY['*/*'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload avatar" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own avatar" ON storage.objects
    FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Template images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'templates');

CREATE POLICY "Authenticated users can upload templates" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'templates' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view own project files" ON storage.objects
    FOR SELECT USING (bucket_id = 'projects' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload project files" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'projects' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- SEED DATA
-- ============================================

-- Demo user (will be created on signup via trigger)
-- Templates seed data
INSERT INTO public.templates (title, description, category, prompt_content, tags, is_premium, framework, status) VALUES
    ('Animated Hero Section', 'A modern hero section with smooth entrance animations', 'hero', 'Create a hero section with fade-in and slide-up animations using Framer Motion', ARRAY['hero', 'animation', 'modern', 'framer-motion'], false, 'framer-motion', 'approved'),
    ('Scroll Reveal Features', 'Features section with scroll-triggered animations', 'landing', 'Create a features section that reveals on scroll using Intersection Observer', ARRAY['features', 'scroll', 'landing'], false, 'framer-motion', 'approved'),
    ('Interactive Pricing Table', 'Pricing table with hover effects and toggle', 'component', 'Create a pricing table with 3 tiers and hover animations', ARRAY['pricing', 'table', 'interactive'], true, 'framer-motion', 'approved'),
    ('Parallax Hero', 'Deep parallax scrolling hero section', 'hero', 'Create a parallax hero with layered backgrounds moving at different speeds', ARRAY['parallax', 'hero', 'scroll'], true, 'gsap', 'approved'),
    ('3D Card Flip', 'Interactive 3D card flip animation', 'component', 'Create a 3D card flip animation on hover', ARRAY['3d', 'card', 'flip', 'interactive'], false, 'framer-motion', 'approved'),
    ('Morphing Menu', 'Animated navigation menu with morphing transitions', 'component', 'Create a hamburger menu that morphs into a fullscreen overlay', ARRAY['menu', 'navigation', 'morph', 'animation'], true, 'framer-motion', 'approved'),
    ('Loading Animations Pack', 'Collection of modern loading spinners', 'animation', 'Create 5 modern loading animations including skeleton, pulse, and wave', ARRAY['loading', 'spinner', 'skeleton', 'animation'], false, 'css', 'approved'),
    ('Glassmorphism Dashboard', 'Modern glass-effect dashboard layout', 'dashboard', 'Create a glassmorphism dashboard with sidebar and cards', ARRAY['dashboard', 'glass', 'modern', 'layout'], true, 'framer-motion', 'approved'),
    ('E-commerce Product Card', 'Product card with image carousel and add to cart', 'ecommerce', 'Create a product card with image carousel, size selector, and add to cart animation', ARRAY['ecommerce', 'product', 'card', 'shopping'], false, 'react-spring', 'approved'),
    ('Smooth Page Transitions', 'Page transition animations for Next.js', 'animation', 'Create smooth page transitions using Framer Motion AnimatePresence', ARRAY['page-transition', 'nextjs', 'animation'], false, 'framer-motion', 'approved')
ON CONFLICT DO NOTHING;

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- ============================================

-- Enable realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_chats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;

-- ============================================
-- VIEWS (useful for dashboard)
-- ============================================

CREATE OR REPLACE VIEW public.user_stats AS
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.subscription_tier,
    p.ai_credits,
    COUNT(DISTINCT pr.id) as total_projects,
    COUNT(DISTINCT t.id) as total_templates,
    COUNT(DISTINCT ac.id) as total_chats,
    COALESCE(SUM(ac.cost_usd), 0) as total_ai_cost
FROM public.profiles p
LEFT JOIN public.projects pr ON pr.user_id = p.id
LEFT JOIN public.templates t ON t.creator_id = p.id
LEFT JOIN public.ai_chats ac ON ac.user_id = p.id
GROUP BY p.id;

CREATE OR REPLACE VIEW public.template_stats AS
SELECT 
    t.*,
    p.full_name as creator_name,
    p.avatar_url as creator_avatar,
    COUNT(DISTINCT f.id) as favorite_count
FROM public.templates t
LEFT JOIN public.profiles p ON p.id = t.creator_id
LEFT JOIN public.favorites f ON f.template_id = t.id
GROUP BY t.id, p.full_name, p.avatar_url;

-- ============================================
-- DONE! 
-- ============================================
-- Your database is now ready for WebMotion.ai
-- Tables: profiles, templates, template_reviews, projects, 
--         deployments, ai_chats, transactions, favorites, 
--         ai_usage, notifications
-- Features: RLS policies, triggers, storage, realtime
-- ============================================
