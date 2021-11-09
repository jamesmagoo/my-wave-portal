import React from 'react';
import PropTypes from 'prop-types';

const Card = (props) => {
  return (
    <div class='bg-white shadow sm:rounded-lg w-1/2 my-4'>
      <div class='px-4 py-5 sm:p-6 border-2 border-blue-500 rounded-lg'>
        <h3 class='text-lg leading-6 font-thin italic text-gray-900'>
          Testing
        </h3>
        <div class='mt-2 max-w-xl text-xs text-gray-500'>
          <p>Address: {props}</p>
        </div>
        <div class='mt-2 max-w-xl text-xs text-gray-500'>
          <p>TimeStamp: </p>
        </div>
      </div>
    </div>
  );
};

Card.propTypes = {
  wave : PropTypes.object.isRequired,
}

export default Card;
