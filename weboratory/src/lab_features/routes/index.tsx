import * as hooks_routes from '@webrary/react/hooks';
import * as svelte_routes from '@webrary/svelte/common';
import * as rn_routes from '@webrary/rn/components';
import { renameRoutesWithDomain } from './utils';
export const routes = {
  ...renameRoutesWithDomain(hooks_routes.default, 'react.hooks', 'Sample'),
  ...renameRoutesWithDomain(svelte_routes.default, 'svelte.common'),
  ...renameRoutesWithDomain(rn_routes.default as any, 'rn.components'),
};
