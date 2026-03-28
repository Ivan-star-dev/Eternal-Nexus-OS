/**
 * ARTIFACT-MEMORY-001 — Public API barrel
 */
export type { ArtifactMeta, ArtifactKind, ArtifactSource, ArtifactStatus, ArtifactFilter, ArtifactSaveResult } from './types';
export {
  saveArtifact,
  updateArtifact,
  getArtifact,
  listArtifacts,
  archiveArtifact,
  deleteArtifact,
  getRecentArtifacts,
  getArtifactsBySession,
} from './store';
