-- Database Schema for Healthy Food Alternatives Platform
-- Target: PostgreSQL / Supabase / Neon

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for junk/high-calorie items
CREATE TABLE IF NOT EXISTS junk_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g., 'snacks', 'drinks', 'fastfood', 'desserts', 'breakfast'
    calories INT NOT NULL, -- per 100g or standard serving
    fat FLOAT NOT NULL, -- in grams
    sugar FLOAT NOT NULL, -- in grams
    sodium FLOAT NOT NULL, -- in milligrams
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for healthy alternative items
CREATE TABLE IF NOT EXISTS healthy_alternatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    calories INT NOT NULL,
    protein FLOAT NOT NULL, -- in grams
    fiber FLOAT NOT NULL, -- in grams
    fat FLOAT DEFAULT 0.0, -- in grams
    sugar FLOAT DEFAULT 0.0, -- in grams
    sodium FLOAT DEFAULT 0.0, -- in milligrams
    image_url TEXT,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Mapping table representing alternative suggestions for a junk food item
CREATE TABLE IF NOT EXISTS alternative_mappings (
    junk_item_id UUID REFERENCES junk_items(id) ON DELETE CASCADE,
    alternative_id UUID REFERENCES healthy_alternatives(id) ON DELETE CASCADE,
    similarity_reason TEXT NOT NULL, -- e.g., "Provides the same savory noodle experience but baked and made of ragi, reducing calories by 40% and adding fiber."
    PRIMARY KEY (junk_item_id, alternative_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_junk_items_slug ON junk_items(slug);
CREATE INDEX IF NOT EXISTS idx_healthy_alternatives_slug ON healthy_alternatives(slug);
CREATE INDEX IF NOT EXISTS idx_junk_items_category ON junk_items(category);

-- Table for Phase 3: Healthy Cuisine Tag mappings for restaurants
CREATE TABLE IF NOT EXISTS healthy_cuisine_tags (
    cuisine_type VARCHAR(100) PRIMARY KEY,
    health_score INT NOT NULL,
    category VARCHAR(100) NOT NULL
);

-- Table for Gym Locator
CREATE TABLE IF NOT EXISTS gyms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    rating FLOAT NOT NULL,
    monthly_fee INT NOT NULL,
    distance_text VARCHAR(100) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    address TEXT NOT NULL,
    amenities TEXT[] NOT NULL,
    is_value_pick BOOLEAN DEFAULT false,
    image_url TEXT,
    contact_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for Supplement Guide
CREATE TABLE IF NOT EXISTS supplements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g., 'protein', 'creatine', 'preworkout', 'multivitamin', 'omega3'
    price INT NOT NULL,
    servings INT NOT NULL,
    dose_per_serving VARCHAR(100) NOT NULL,
    price_per_serving FLOAT NOT NULL,
    rating FLOAT NOT NULL,
    tier VARCHAR(50) NOT NULL, -- 'market_leader' or 'value_pick'
    buy_links JSONB NOT NULL,
    image_url TEXT,
    benefits TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

