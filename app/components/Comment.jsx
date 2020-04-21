import React from 'react';
import PropTypes from 'prop-types';

import PostMetaInfo from './PostMetaInfo';

function Comment({ comment }) {
  return (
    <div className='comment'>
      <PostMetaInfo
        comment
        by={comment.by}
        time={comment.time}
        id={comment.id}
      />
      <p dangerouslySetInnerHTML={{ __html: comment.text }} />
    </div>
  );
}

Comment.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  comment: PropTypes.object.isRequired,
};

export default Comment;
