'use client';
import React from 'react';

const TagsList = ({ checks, onTagClick, selectedTags }) => {
  const uniqueTags = new Set(checks.flatMap((check) => check.tags || []));

  const handleTagClick = (tag) => {
    onTagClick(tag); // Callback to inform parent component
  };

  return (
    <div style={{ width: '100%' }}>
      <h3 style={{ color: 'white', fontSize: '18px' }}>Tags:</h3>
      {[...uniqueTags].map((tag) => (
        <span
          key={tag}
          onClick={() => handleTagClick(tag)}
          style={{
            color: selectedTags.includes(tag) ? 'blue' : 'white',
            cursor: 'pointer',
          }}
        >
          {tag}{" "}
        </span>
      ))}
    </div>
  );
};

export default TagsList;
