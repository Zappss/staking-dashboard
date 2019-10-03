import { anyString, instance, mock, when } from 'ts-mockito';
import GitHub from 'github-api';
import { GitHubService, IGithubService } from '../../services/gitHubService';
import { buildGetRepositoryResponse } from '../testKits/apis/githubApi';

describe('Social Data in the app', () => {
  let mockedGitHubApi: GitHub;

  // Initialize a new mock
  beforeEach(() => {
    mockedGitHubApi = mock(GitHub);
  });

  it('Should extract the last commit message properly', async () => {
    const expectedLastCommit = 'This is the latest commit';

    // Build the mocked response
    const mockedRepositoryResponse = buildGetRepositoryResponse(expectedLastCommit);

    when(mockedGitHubApi.getRepo(anyString(), anyString())).thenReturn(mockedRepositoryResponse);

    const gitHubService = buildWithMocks(mockedGitHubApi);

    const lastCommitGist = await gitHubService.getRepoLastCommitGist('orbs', 'orbs');

    expect(lastCommitGist).toEqual({ message: expectedLastCommit });
  });
});

function buildWithMocks(mockedGithubApi: GitHub): IGithubService {
  const githubApi = instance(mockedGithubApi);

  const githubService: IGithubService = new GitHubService(githubApi);

  return githubService;
}
