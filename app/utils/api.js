const api = `https://hacker-news.firebaseio.com/v0`;
const json = '.json?print=pretty';

function removeDead(posts) {
  return posts.filter(Boolean).filter(({ dead }) => dead !== true);
}

function removeDeleted(posts) {
  return posts.filter(({ deleted }) => deleted !== true);
}

function onlyComments(posts) {
  return posts.filter(({ type }) => type === 'comment');
}

function onlyPosts(posts) {
  return posts.filter(({ type }) => type === 'story');
}

export async function fetchItem(id) {
  const res = await fetch(`${api}/item/${id}${json}`);
  return res.json();
}

export async function fetchComments(ids) {
  const comments = await Promise.all(ids.map(fetchItem));
  return removeDeleted(onlyComments(removeDead(comments)));
}

export async function fetchMainPosts(type) {
  const res = await fetch(`${api}/${type}stories${json}`);
  const ids = await res.json();
  if (!ids) {
    throw new Error(`There was an error fetching the ${type} posts.`);
  }
  const limitedIds = ids.slice(0, 50);
  const posts = await Promise.all(limitedIds.map(fetchItem));
  return removeDeleted(onlyPosts(removeDead(posts)));
}

export async function fetchUser(id) {
  const res = await fetch(`${api}/user/${id}${json}`);
  return res.json();
}

export async function fetchPosts(ids) {
  const posts = await Promise.all(ids.map(fetchItem));
  return removeDeleted(onlyPosts(removeDead(posts)));
}
