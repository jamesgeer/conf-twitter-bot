import { Paper, Tweet } from "./data.js";
import { Config } from "./util.js";

export async function postTweet(tweet: Tweet): Promise<Tweet | null> {
  const response = await fetch('/queue-tweet', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tweet)
  });
  const result = await response.json();
  if (result.ok) {
    return result.tweet;
  } else {
    return null;
  }
}

export async function getPaperById(id: number | undefined): Promise<Paper | null> {
  if (typeof id !== 'number') {
    return null;
  }

  const response = await fetch(`/paper/${id}`);
  return await response.json();
}

export async function loadUrls(urls: string): Promise<Paper[]> {
  const response = await fetch('/load-urls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({urls})
  });

  const data = await response.json();
  return <Paper[]>data.papers;
}

export async function loadQueuedTweets(): Promise<Tweet[]> {
  const response = await fetch('/load-queue');
  const data = await response.json();
  const tweets: Tweet[] = data.tweets;

  if (tweets) {
    // need to enforce order by schedule
    tweets.sort((a, b) => {
      if (a.scheduledTime === b.scheduledTime) { return 0; }
      if (typeof a.scheduledTime !== 'string') {
        return -1;
      }
      if (typeof b.scheduledTime !== 'string') {
        return 1;
      }
      return a.scheduledTime.localeCompare(b.scheduledTime);
    })
  }

  return tweets;
}

export async function getConfiguration(): Promise<Config> {
  const response = await fetch('/configuration');
  return await response.json();
}

export async function persistConfig(config: Config) {
  const response = await fetch('/configuration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(config)
  });
  await response.json();
}
