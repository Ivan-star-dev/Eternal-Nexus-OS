/**
 * Global R3F JSX namespace augmentation for @react-three/fiber@8.x
 * 
 * With moduleResolution: 'bundler' + isolatedModules: true, the R3F package
 * does not automatically augment JSX.IntrinsicElements. This file forces
 * the augmentation globally so all .tsx files see R3F elements without
 * needing to import from @react-three/fiber in every file.
 */

/// <reference types="@react-three/fiber" />
