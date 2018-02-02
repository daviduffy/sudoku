import React from 'react';
import PropTypes from 'prop-types';

const Header = (props) => {
  return (
    <header className="header">
      <h1 className="h1">{props.title}</h1>
      <p>{props.subtitle}</p>
    </header>
  );
}
Header.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
}

export default Header;
