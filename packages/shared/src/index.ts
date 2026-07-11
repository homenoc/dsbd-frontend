// @dsbd/shared — code shared between apps/web and apps/admin.
// Subpath entries are also exported for tree-shaking: '@dsbd/shared/vlan' etc.

export * from './vlan';
export * from './api';
export * from './constants';
// export * from './types';      // F4: wire types split from interface.ts
