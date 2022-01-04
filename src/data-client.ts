import { sortSchedule } from "./scheduling.js";
import { Paper, Tweet, Config } from "./data-types.js";

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

export async function deleteTweetFromQueue(id: number): Promise<void> {
  const response = await fetch(`/delete-tweet/${id}`);
  await response.json();
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

export async function loadQueuedTweets(): Promise<(Tweet | null)[]> {
  const response = await fetch('/load-queue');
  const data = await response.json();
  const tweets: (Tweet | null)[] = data.tweets;

  if (tweets) {
    sortSchedule(tweets);
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
