-- WebMotion.ai Database Schema
-- Migration: 001_initial_schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    avatar_url VARCHAR(500),
    subscription_tier VARCHAR(20) DEFAULT 'free' NOT NULL,
    ai_credits INTEGER DEFAULT 100 NOT NULL,
    lifetime_deal BOOLEAN DEFAULT FALSE NOT NULL,
    stripe_customer_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(100),
    prompt_content TEXT NOT NULL,
    code_output TEXT,
    preview_image VARCHAR(500),
    preview_video VARCHAR(500),
    tags TEXT[] DEFAULT '{}',
    is_premium BOOLEAN DEFAULT FALSE NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0 NOT NULL,
    downloads INTEGER DEFAULT 0 NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 0 NOT NULL,
    rating_count INTEGER DEFAULT 0 NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Template Reviews table
CREATE TABLE IF NOT EXISTS template_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES templates(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
    generated_code TEXT,
    deployment_url VARCHAR(500),
    deployment_status VARCHAR(20) DEFAULT 'draft' NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Deployments table
CREATE TABLE IF NOT EXISTS deployments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    provider VARCHAR(20) NOT NULL,
    repository_url VARCHAR(500),
    deployment_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'pending' NOT NULL,
    logs TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- AI Chats table
CREATE TABLE IF NOT EXISTS ai_chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    messages JSONB DEFAULT '[]',
    model_used VARCHAR(50) NOT NULL,
    tokens_input INTEGER DEFAULT 0 NOT NULL,
    tokens_output INTEGER DEFAULT 0 NOT NULL,
    cost_usd DECIMAL(10, 6) DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    type VARCHAR(30) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    stripe_payment_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_creator ON templates(creator_id);
CREATE INDEX idx_templates_status ON templates(status);
CREATE INDEX idx_template_reviews_template ON template_reviews(template_id);
CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_projects_template ON projects(template_id);
CREATE INDEX idx_deployments_project ON deployments(project_id);
CREATE INDEX idx_ai_chats_user ON ai_chats(user_id);
CREATE INDEX idx_ai_chats_project ON ai_chats(project_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_stripe ON transactions(stripe_payment_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deployments_updated_at BEFORE UPDATE ON deployments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert seed data
INSERT INTO users (email, name, subscription_tier, ai_credits) VALUES
    ('demo@webmotion.ai', 'Demo User', 'pro', 10000)
ON CONFLICT (email) DO NOTHING;

INSERT INTO templates (title, description, category, prompt_content, tags, is_premium, status) VALUES
    ('Animated Hero Section', 'A modern hero section with smooth entrance animations', 'hero', 'Create a hero section with fade-in and slide-up animations', ARRAY['hero', 'animation', 'modern'], false, 'approved'),
    ('Scroll Reveal Features', 'Features section with scroll-triggered animations', 'landing', 'Create a features section that reveals on scroll', ARRAY['features', 'scroll', 'landing'], false, 'approved'),
    ('Pricing Table', 'Interactive pricing table with hover effects', 'component', 'Create a pricing table with 3 tiers and hover animations', ARRAY['pricing', 'table', 'interactive'], true, 'approved')
ON CONFLICT DO NOTHING;
