import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

import Loading from './Loading';
import PostsList from './PostsList';
import { fetchMainPosts } from '../utils/api';

const initialState = {
  error: null,
  loading: true,
  posts: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'request':
      return { ...state, loading: true };
    case 'success':
      return { posts: action.payload, loading: false, error: null };
    case 'failure':
      return { ...state, loading: false, error: action.payload.message };
    default:
      throw new Error('unknown action');
  }
};

function Posts({ type }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: 'request' });
    fetchMainPosts(type)
      .then(posts => dispatch({ type: 'success', payload: posts }))
      .catch(err => dispatch({ type: 'failure', payload: err }));
  }, [type]);

  const { error, loading, posts } = state;

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p className='center-text error'>{error}</p>;
  }

  return <PostsList posts={posts} />;
}

Posts.propTypes = {
  type: PropTypes.oneOf(['top', 'new']).isRequired,
};

export default Posts;
