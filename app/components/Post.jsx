import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import Comment from './Comment';
import Loading from './Loading';
import PostMetaInfo from './PostMetaInfo';
import Title from './Title';
import { fetchItem, fetchComments } from '../utils/api';

const initialState = {
  post: null,
  loadingPost: true,
  comments: null,
  loadingComments: true,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'postSuccess':
      return { ...state, loadingPost: false, post: action.payload };
    case 'commentsSuccess':
      return { ...state, loadingComments: false, comments: action.payload };
    case 'failure':
      return {
        ...state,
        loadingPost: false,
        loadingComments: false,
        error: action.payload.message,
      };
    default:
      throw new Error('unknown action');
  }
};

function Post({ location: { search } }) {
  const { id } = queryString.parse(search);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const getData = async () => {
      try {
        const post = await fetchItem(id);
        dispatch({ type: 'postSuccess', payload: post });
        const comments = await fetchComments(post.kids || []);
        dispatch({ type: 'commentsSuccess', payload: comments });
      } catch (err) {
        dispatch({ type: 'failure', payload: err });
      }
    };
    getData();
  }, [id]);

  const { post, loadingPost, comments, loadingComments, error } = state;

  if (error) {
    return <p className='center-text error'>{error}</p>;
  }

  return (
    <>
      {loadingPost ? (
        <Loading text='Fetching post' />
      ) : (
        <>
          <h1 className='header'>
            <Title url={post.url} title={post.title} id={post.id} />
          </h1>
          <PostMetaInfo
            by={post.by}
            time={post.time}
            id={post.id}
            descendants={post.descendants}
          />
          <p dangerouslySetInnerHTML={{ __html: post.text }} />
        </>
      )}
      {loadingComments ? (
        !loadingPost && <Loading text='Fetching comments' />
      ) : (
        <>
          {comments.map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </>
      )}
    </>
  );
}

Post.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

export default Post;
