'use client';

import React, { useState } from 'react';
import axios from 'axios';

// Define your API key for authentication
const apiKey = 'sv_e3b289cd144c4aba9b94259dbe50562b';
const accountID = '70a705d3-488c-4ade-8f54-376ae7e974ba';

const ApiForm = () => {
  const [accountId, setAccountId] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.get('https://api.example.com/endpoint', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      params: {
        accountId: accountId,
      },
    });
    console.log(response.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
        placeholder='Account ID'
      />
      <input
        type='text'
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder='API Key'
      />
      <button type='submit'>Submit</button>
    </form>
  );
};

export default ApiForm;
