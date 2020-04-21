import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import Loading from './Loading';
import PostsList from './PostsList';
import { fetchUser, fetchPosts } from '../utils/api';
import { formatDate } from '../utils/helpers';

const initialState = {
  user: null,
  loadingUser: true,
  posts: null,
  loadingPosts: true,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'userSuccess':
      return { ...state, loadingUser: false, user: action.payload };
    case 'postsSuccess':
      return { ...state, loadingPosts: false, posts: action.payload };
    case 'failure':
      return {
        ...state,
        loadingUser: false,
        loadingPosts: false,
        error: action.payload.message,
      };
    default:
      throw new Error('unknown action');
  }
};

function User({ location: { search } }) {
  const { id } = queryString.parse(search);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const getData = async () => {
      try {
        const user = await fetchUser(id);
        dispatch({ type: 'userSuccess', payload: user });
        const posts = await fetchPosts(user.submitted.slice(0, 30));
        dispatch({ type: 'postsSuccess', payload: posts });
      } catch (err) {
        dispatch({ type: 'failure', payload: err });
      }
    };
    getData();
  }, [id]);

  const { user, posts, loadingUser, loadingPosts, error } = state;

  if (error) {
    return <p className='center-text error'>{error}</p>;
  }

  return (
    <>
      {loadingUser ? (
        <Loading text='Fetching User' />
      ) : (
        <>
          <h1 className='header'>{user.id}</h1>
          <div className='meta-info-light'>
            <span>
              joined <b>{formatDate(user.created)}</b>
            </span>
            <span>
              has <b>{user.karma.toLocaleString()}</b> karma
            </span>
          </div>
          <p dangerouslySetInnerHTML={{ __html: user.about }} />
        </>
      )}
      {loadingPosts ? (
        !loadingUser && <Loading text='Fetching posts' />
      ) : (
        <>
          <h2>Posts</h2>
          <PostsList posts={posts} />
        </>
      )}
    </>
  );
}

User.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

export default User;
