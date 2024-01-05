'use client';
import React from 'react'

const TagsList = ({checks}) => {
  const uniqueTags = [];

  // Filter out empty tag arrays from checks
  checks = checks.filter((check) => check.tags && check.tags.length > 0);

  checks.forEach((check) => {
    check.tags.forEach((tag) => {
      if (!uniqueTags.includes(tag)) uniqueTags.push(tag);
    });
  });
  return (
    <div style={{ width: '100%' }}>
      <h3 style={{ color: 'white', fontSize: '18px' }}>Tags:</h3>
      {uniqueTags.map((tag) => tag + ' ' )}
    </div>  )
}

export default TagsList;
