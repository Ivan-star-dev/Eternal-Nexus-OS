/**
 * SessionBoot — V4-SESSION-001
 *
 * Null-render component that activates session memory tracking.
 * Must be rendered inside BrowserRouter (useLocation dependency).
 * Place once in App.tsx, inside <BrowserRouter>.
 */

import { useSessionMemory } from '@/hooks/useSessionMemory';

const SessionBoot = () => {
  useSessionMemory();
  return null;
};

export default SessionBoot;
