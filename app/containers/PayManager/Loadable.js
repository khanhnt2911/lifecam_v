/**
 *
 * Asynchronously loads the component for PayManager
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));
