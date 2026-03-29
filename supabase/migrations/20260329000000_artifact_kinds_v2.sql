-- ARTIFACT-KINDS-V2
-- Extend artifacts.kind and artifacts.source CHECK constraints for tri-core parity.
-- New kinds: experiment, evidence, hypothesis (Lab), lesson (School)
-- New sources: school, test
-- Date: 2026-03-29

-- Drop old kind constraint, add extended one
ALTER TABLE artifacts DROP CONSTRAINT IF EXISTS artifacts_kind_check;
ALTER TABLE artifacts ADD CONSTRAINT artifacts_kind_check
  CHECK (kind IN (
    'research', 'note', 'plan', 'simulation',
    'draft', 'code', 'synthesis', 'decision',
    'experiment', 'evidence', 'hypothesis', 'lesson'
  ));

-- Drop old source constraint, add extended one
ALTER TABLE artifacts DROP CONSTRAINT IF EXISTS artifacts_source_check;
ALTER TABLE artifacts ADD CONSTRAINT artifacts_source_check
  CHECK (source IN (
    'nexus', 'lab', 'school', 'test', 'atlas', 'manual', 'import'
  ));
