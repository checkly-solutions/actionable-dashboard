'use client';

import React from 'react';

const GroupList = ({ groups }) => {
  // Create an array to hold unique groups with both name and id
  const uniqueGroups = [];

  if (groups) {
    groups.forEach(group => {
      // Check if a group with the same id already exists in the array
      if (group.name && !uniqueGroups.some(g => g.id === group.id)) {
        uniqueGroups.push({ id: group.id, name: group.name });
      }
    });
  }

  return (
    <div style={{ width: '100%' }}>
      <h3 style={{ color: 'white', fontSize: '18px' }}>Groups:</h3>
      {uniqueGroups.map(group => (
        <span key={group.id}>{group.name} </span>
      ))}
    </div>
  );
};

export default GroupList;
