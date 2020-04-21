import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const styles = {
  content: {
    fontSize: '35px',
    position: 'absolute',
    left: '0',
    right: '0',
    marginTop: '20px',
    textAlign: 'center',
  },
};

function Loading({ speed, text }) {
  const [content, setContent] = useState(text);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setContent(c => (c === `${text}...` ? text : `${c}.`));
    }, speed);
    return () => clearInterval(intervalId);
  }, [text, speed]);

  return <p style={styles.content}>{content}</p>;
}

Loading.propTypes = {
  speed: PropTypes.number,
  text: PropTypes.string,
};

Loading.defaultProps = {
  speed: 300,
  text: 'Loading',
};

export default Loading;
