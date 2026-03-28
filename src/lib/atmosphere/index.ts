/**
 * ATMOSPHERE-CONTROLLER-001 — Public API barrel
 */
export type { AtmosphereState, AtmosphereTransition } from './controller';
export {
  getAtmosphereForPortal,
  getAtmosphereForPath,
  invalidateAtmosphereCache,
  buildPortalWrapperStyle,
  buildAmbientOverlayStyle,
  buildGridOverlayStyle,
} from './controller';
