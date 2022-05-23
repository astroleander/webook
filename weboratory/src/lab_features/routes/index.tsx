import * as hooks_routes from '@webrary/react/hooks';
import { renameRoutesWithDomain } from './utils';

export const routes = {
  ...renameRoutesWithDomain(hooks_routes.default, 'react.hooks'),
};