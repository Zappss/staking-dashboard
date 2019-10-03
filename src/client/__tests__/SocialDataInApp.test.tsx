/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import '@testing-library/jest-dom/extend-expect';
import { AppDriver } from './testKits/AppDriver';
import { AppHydration } from './testKits/AppHydration';
import { ApiDependenciesKit } from './testKits/apis/ApiDependenciesKit';

describe('Social Data in the app', () => {
  let appHydration: AppHydration;
  let appDriver: AppDriver;

  beforeEach(() => {
    appDriver = new AppDriver();
    appHydration = new AppHydration();
  });

  it('should display the "Latest commit" from the hydrated hydrated Social store', async () => {
    const hydrationCommit = 'Hydration Commit';
    const apiCommit = 'Api Commit';

    // Set the commit for the hydration
    appHydration.withLatestCommit(hydrationCommit);

    // Set the commit for the 'real world'
    appDriver.outerWorldState.setLastGitHubCommitMessage(apiCommit);

    const { getByTestId } = appDriver.hydrateApp(appHydration).render();
    expect(getByTestId('latest-commit')).toHaveTextContent(hydrationCommit);

    await appDriver.initApp();
    expect(getByTestId('latest-commit')).toHaveTextContent(apiCommit);
  });

  it('should display the "Latest tweet" from the hydrated hydrated Social store', async () => {
    appHydration.withLatestTweet('Latest tweet');

    const { getByTestId } = appDriver.hydrateApp(appHydration).render();
    expect(getByTestId('latest-tweet')).toHaveTextContent('Latest tweet');

    await appDriver.initApp();
    expect(getByTestId('latest-tweet')).toHaveTextContent('Latest tweet');
  });

  it('should display the "Recent Update" from the hydrated hydrated Social store', async () => {
    appHydration.withRecentUpdate('Recent Update');

    const { getByTestId } = appDriver.hydrateApp(appHydration).render();
    expect(getByTestId('recent-update')).toHaveTextContent('Recent Update');

    await appDriver.initApp();
    expect(getByTestId('recent-update')).toHaveTextContent('Recent Update');
  });
});