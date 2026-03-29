import React from 'react';
import '../../styles/atlas-glassmorphism.css';

export interface GlassmorphismPanelProps {
  /** Visual variant: "default" = standard glass, "dark" = deeper / more recessed */
  variant?: 'default' | 'dark';
  /** Additional CSS class names to merge onto the panel root */
  className?: string;
  /** Panel content */
  children?: React.ReactNode;
  /** Forward a ref to the underlying div */
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * GlassmorphismPanel
 *
 * A thin React wrapper that applies the Eternal Nexus dark glassmorphism
 * surface styles (`.atlas-glass-panel` / `.atlas-glass-panel--dark`) from
 * the atlas style system. Use as a container for any atlas / map HUD content.
 *
 * @example
 * <GlassmorphismPanel variant="dark" className="p-4 w-72">
 *   <span className="atlas-label atlas-label--cyan">Sector 7</span>
 * </GlassmorphismPanel>
 */
const GlassmorphismPanel = React.forwardRef<HTMLDivElement, GlassmorphismPanelProps>(
  ({ variant = 'default', className, children }, ref) => {
    const baseClass = 'atlas-glass-panel';
    const variantClass = variant === 'dark' ? 'atlas-glass-panel--dark' : '';
    const composedClass = [baseClass, variantClass, className]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={composedClass}>
        {children}
      </div>
    );
  }
);

GlassmorphismPanel.displayName = 'GlassmorphismPanel';

export default GlassmorphismPanel;
