-- TABLA DE LEADS (OBJETIVOS COMERCIALES)
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    address TEXT,
    neighborhood TEXT,
    score INTEGER DEFAULT 0,
    status TEXT DEFAULT 'low',
    website TEXT,
    strategy TEXT,
    conversion_gap TEXT,
    estimated_loss TEXT,
    assigned_to UUID REFERENCES auth.users(id),
    follow_up_status TEXT DEFAULT 'NEW',
    last_audit TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    phone TEXT,
    draft_email TEXT,
    tech_stack TEXT,
    speed_score INTEGER
);

-- TABLA DE REGISTROS DE AUTOMATIZACIÓN (BOT LOGS)
CREATE TABLE automation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    bot_id TEXT,
    action TEXT,
    details JSONB,
    status TEXT -- 'info', 'success', 'warning', 'error'
);

-- TABLA DE MÉTRICAS DE EQUIPO
CREATE TABLE team_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    name TEXT,
    avatar_url TEXT,
    closes INTEGER DEFAULT 0,
    total_revenue NUMERIC DEFAULT 0,
    active_leads INTEGER DEFAULT 0
);

-- RLS POLICIES (Seguridad básica)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir lectura a usuarios autenticados" ON leads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir inserción a usuarios autenticados" ON leads FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Permitir actualización a usuarios autenticados" ON leads FOR UPDATE USING (auth.role() = 'authenticated');
