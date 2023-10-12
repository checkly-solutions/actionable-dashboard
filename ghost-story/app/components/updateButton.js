'use client';

import React from 'react';
import { updateCheck } from '../api/routes';
const buttonStyle = { margin: '5px', padding: '5px' };

function HandleButton({ checkId, currentState, updateType, onSubmit }) {
  const handleClick = async () => {
    const updateData = { [updateType]: !currentState };
    try {
      const response = await updateCheck(checkId, updateData);
      console.log('Update response:', response);
    } catch (error) {
      console.error('Error updating check:', error);
    }
    onSubmit();
  };

  const buttonText =
    updateType === 'activated'
      ? currentState
        ? 'Deactivate'
        : 'Activate'
      : currentState
      ? 'Unmute'
      : 'Mute';

  return (
    <button style={buttonStyle} onClick={handleClick}>
      {buttonText}
    </button>
  );
}

export default HandleButton;
