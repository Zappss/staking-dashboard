import Twitter from 'twitter';
import { ITwitGist } from '../../shared/IStoreTypes';

interface IServerService {
  init: () => Promise<void>;
}

export interface IOrbsTwitterService extends IServerService {
  getCachedLatestTweetGist(): ITwitGist;
  fetchAndCacheLatestTweetGist(): void;
}

export class OrbsTwitterService implements IOrbsTwitterService {
  private latestTweetGist: ITwitGist = null;

  constructor(private twitterClient: Twitter, private screenName: string) {}

  public getCachedLatestTweetGist(): ITwitGist {
    return this.latestTweetGist;
  }

  public async init() {
    await this.fetchAndCacheLatestTweetGist();
  }

  /**
   * Fetched the latest tweet gist from Twitter and replaces the current cached one.
   */
  public async fetchAndCacheLatestTweetGist(): Promise<void> {
    this.latestTweetGist = await this.fetchFreshLatestTweet();
  }

  private async fetchFreshLatestTweet(): Promise<ITwitGist> {
    const params: Twitter.RequestParams = {
      screen_name: this.screenName,
      exclude_replies: true, // No need for replies
      include_rts: false, // No need for re-tweets
    };

    const res = await this.twitterClient.get('statuses/user_timeline', params);

    // The first tweet is the latest
    const latestTweet = res[0];

    // Get the tweet URL (Using the expanded_url allows the user to get to the twitter page directly without getting redirected)
    const { entities } = latestTweet;
    const { urls } = entities;
    const tweetInTextUrl = urls[0].url; // This minified url is added to the end of each tweet message. we would like to remove it.
    const tweetUrl = urls[0].expanded_url;

    const tweetText = prepareTweetTextForDisplay(latestTweet.text, latestTweet.truncated, [tweetInTextUrl]);

    return {
      tweetText,
      tweetUrl,
    };
  }
}

/**
 * Handles cases of 'truncated' tweet text to ensure proper displayable values.
 */
function prepareTweetTextForDisplay(rawTweetText: string, isTruncated: boolean, stringsToRemove?: string[]) {
  let textForDisplay = rawTweetText;

  // Removes all given strings from the text for display
  if (stringsToRemove) {
    stringsToRemove.forEach(textToRemove => {
      textForDisplay = textForDisplay.replace(textToRemove, '');
    });
  }

  // Twitter adds a '…' with a shortend link for truncated tweets. we will remove this special char and the
  // link to deliver only text.
  if (isTruncated) {
    const HORIZONTAL_ELIPSIS = '…';

    // Take just the relevant text part
    textForDisplay = textForDisplay.replace(HORIZONTAL_ELIPSIS, '...');
  }

  return textForDisplay;
}
