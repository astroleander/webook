import * as hooks_routes from '@webrary/react/hooks';
import * as svelte_routes from '@webrary/svelte/common/index';

import { renameRoutesWithDomain } from './utils';

export const routes = {
  ...renameRoutesWithDomain(hooks_routes.default, 'react.hooks', 'Sample'),
  ...renameRoutesWithDomain(svelte_routes.default, 'svelte.common'),
};