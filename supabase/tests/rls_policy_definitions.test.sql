-- ═══════════════════════════════════════════════════════════════
-- pgTAP: Validate RLS policy DEFINITIONS (USING expressions)
--
-- Protects against accidental policy changes in migrations.
-- Tests the actual policies on project_metrics, metric_history,
-- activity_log, system_status, and project_progress.
--
-- All use has_role(auth.uid(), 'owner') for management
-- and true/public for read access.
-- ═══════════════════════════════════════════════════════════════

begin;
select plan(12);

-- ═══════════════════════════════════════════
-- 1. project_metrics: owner manage uses has_role
-- ═══════════════════════════════════════════

select matches(
    (select polqual::text from pg_policies
     where schemaname = 'public' and tablename = 'project_metrics'
       and policyname = 'Owners can manage metrics'),
    'has_role',
    'project_metrics owner policy USING references has_role'
);

select matches(
    (select polqual::text from pg_policies
     where schemaname = 'public' and tablename = 'project_metrics'
       and policyname = 'Public read metrics'),
    'true',
    'project_metrics public read USING is true'
);

-- ═══════════════════════════════════════════
-- 2. metric_history: owner manage + anon read
-- ═══════════════════════════════════════════

select matches(
    (select polqual::text from pg_policies
     where schemaname = 'public' and tablename = 'metric_history'
       and policyname = 'owner_manage_history'),
    'has_role',
    'metric_history owner policy USING references has_role'
);

select matches(
    (select polqual::text from pg_policies
     where schemaname = 'public' and tablename = 'metric_history'
       and policyname = 'anon_read_history'),
    'true',
    'metric_history anon read USING is true'
);

-- ═══════════════════════════════════════════
-- 3. activity_log policies
-- ═══════════════════════════════════════════

select matches(
    (select polqual::text from pg_policies
     where schemaname = 'public' and tablename = 'activity_log'
       and policyname = 'Owners can manage activity'),
    'has_role',
    'activity_log owner policy USING references has_role'
);

select matches(
    (select polqual::text from pg_policies
     where schemaname = 'public' and tablename = 'activity_log'
       and policyname = 'Public read activity'),
    'true',
    'activity_log public read USING is true'
);

-- ═══════════════════════════════════════════
-- 4. system_status policies
-- ═══════════════════════════════════════════

select matches(
    (select polqual::text from pg_policies
     where schemaname = 'public' and tablename = 'system_status'
       and policyname = 'Owners can manage status'),
    'has_role',
    'system_status owner policy USING references has_role'
);

select matches(
    (select polqual::text from pg_policies
     where schemaname = 'public' and tablename = 'system_status'
       and policyname = 'Public read status'),
    'true',
    'system_status public read USING is true'
);

-- ═══════════════════════════════════════════
-- 5. project_progress policies
-- ═══════════════════════════════════════════

select matches(
    (select polqual::text from pg_policies
     where schemaname = 'public' and tablename = 'project_progress'
       and policyname = 'Owners can manage progress'),
    'has_role',
    'project_progress owner policy USING references has_role'
);

select matches(
    (select polqual::text from pg_policies
     where schemaname = 'public' and tablename = 'project_progress'
       and policyname = 'Public read progress'),
    'true',
    'project_progress public read USING is true'
);

-- ═══════════════════════════════════════════
-- 6. user_roles: owner manage uses has_role
-- ═══════════════════════════════════════════

select matches(
    (select polqual::text from pg_policies
     where schemaname = 'public' and tablename = 'user_roles'
       and policyname = 'Owners can manage roles'),
    'has_role',
    'user_roles owner policy USING references has_role'
);

-- user own roles uses auth.uid()
select matches(
    (select polqual::text from pg_policies
     where schemaname = 'public' and tablename = 'user_roles'
       and policyname = 'Users can view own roles'),
    'auth\.uid',
    'user_roles self-view policy USING references auth.uid()'
);

select * from finish();
rollback;
