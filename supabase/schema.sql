-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'researcher', 'enterprise', 'admin', 'amd_partner')),
  tier TEXT DEFAULT 'standard' CHECK (tier IN ('standard', 'pro', 'enterprise')),
  badge TEXT DEFAULT 'bronze' CHECK (badge IN ('bronze', 'silver', 'gold', 'platinum')),
  analysis_count INTEGER DEFAULT 0,
  optimization_mode TEXT DEFAULT 'standard' CHECK (optimization_mode IN ('standard', 'edge-optimized', 'performance')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analyses table
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  query TEXT NOT NULL,
  model TEXT NOT NULL,
  output TEXT NOT NULL,
  confidence_score FLOAT NOT NULL,
  reliability_score FLOAT NOT NULL,
  trust_deviation FLOAT NOT NULL,
  calibration_index FLOAT NOT NULL,
  verification_latency INTEGER NOT NULL,
  optimization_mode TEXT DEFAULT 'standard',
  processing_mode TEXT DEFAULT 'standard',
  hardware_profile TEXT DEFAULT 'cpu',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Claims table
CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  confidence FLOAT NOT NULL,
  reliability FLOAT NOT NULL,
  verified BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  message TEXT NOT NULL,
  metadata JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  deviation_threshold FLOAT DEFAULT 15.0,
  reliability_minimum FLOAT DEFAULT 70.0,
  confidence_minimum FLOAT DEFAULT 60.0,
  optimization_mode TEXT DEFAULT 'standard',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  resource TEXT NOT NULL,
  metadata JSONB,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'success')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Benchmarks table
CREATE TABLE IF NOT EXISTS benchmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  mode TEXT NOT NULL CHECK (mode IN ('standard', 'accelerated')),
  avg_verification_time FLOAT NOT NULL,
  claim_extraction_time FLOAT NOT NULL,
  total_processing_time FLOAT NOT NULL,
  calibration_stability FLOAT NOT NULL,
  throughput FLOAT NOT NULL,
  memory_usage FLOAT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at);
CREATE INDEX IF NOT EXISTS idx_analyses_trust_deviation ON analyses(trust_deviation);
CREATE INDEX IF NOT EXISTS idx_analyses_optimization_mode ON analyses(optimization_mode);

CREATE INDEX IF NOT EXISTS idx_claims_analysis_id ON claims(analysis_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_created ON notifications(read, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_severity ON notifications(severity);

CREATE INDEX IF NOT EXISTS idx_settings_user_id ON settings(user_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

CREATE INDEX IF NOT EXISTS idx_benchmarks_user_id ON benchmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_benchmarks_mode ON benchmarks(mode);
CREATE INDEX IF NOT EXISTS idx_benchmarks_created_at ON benchmarks(created_at);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE benchmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (true);

CREATE POLICY "Service role can do anything" ON users
  USING (true);

-- RLS Policies for analyses table
CREATE POLICY "Users can view all analyses" ON analyses
  FOR SELECT USING (true);

CREATE POLICY "Users can insert analyses" ON analyses
  FOR INSERT WITH CHECK (true);

-- RLS Policies for claims table
CREATE POLICY "Users can view all claims" ON claims
  FOR SELECT USING (true);

CREATE POLICY "Users can insert claims" ON claims
  FOR INSERT WITH CHECK (true);

-- RLS Policies for notifications table
CREATE POLICY "Users can view all notifications" ON notifications
  FOR SELECT USING (true);

CREATE POLICY "Users can update notifications" ON notifications
  FOR UPDATE USING (true);

CREATE POLICY "Users can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- RLS Policies for settings table
CREATE POLICY "Users can view all settings" ON settings
  FOR SELECT USING (true);

CREATE POLICY "Users can insert settings" ON settings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update settings" ON settings
  FOR UPDATE USING (true);

-- RLS Policies for audit_logs table
CREATE POLICY "Users can view all audit logs" ON audit_logs
  FOR SELECT USING (true);

CREATE POLICY "Users can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- RLS Policies for benchmarks table
CREATE POLICY "Users can view all benchmarks" ON benchmarks
  FOR SELECT USING (true);

CREATE POLICY "Users can insert benchmarks" ON benchmarks
  FOR INSERT WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for settings table
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update user badge based on analysis count
CREATE OR REPLACE FUNCTION update_user_badge()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET badge = CASE
    WHEN analysis_count >= 200 THEN 'platinum'
    WHEN analysis_count >= 51 THEN 'gold'
    WHEN analysis_count >= 11 THEN 'silver'
    ELSE 'bronze'
  END
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update badge when analysis is created
CREATE TRIGGER update_badge_on_analysis
  AFTER INSERT ON analyses
  FOR EACH ROW
  WHEN (NEW.user_id IS NOT NULL)
  EXECUTE FUNCTION update_user_badge();
