'use client';

import React, { useState, useEffect } from 'react';
import { getAllChecks, getAllCheckStatuses } from '../api/routes';

const cellStyle = {
  paddingLeft: '10px',
  paddingTop: '10px',
  border: '1px solid teal',
};
const buttonStyle = { margin: '5px', padding: '5px' };

const getStatus = (check) => {
  if (check.status.hasFailures) {
    return 'Failing';
  } else if (check.status.hasErrors || check.status.isDegraded) {
    return 'Degraded';
  } else {
    return 'Passing';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Failing':
      return 'red';
    case 'Degraded':
      return 'yellow';
    case 'Passing':
    default:
      return 'green';
  }
};

function ChecksTable() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [checkStatusesResponse, checksResponse] = await Promise.all([
          getAllCheckStatuses(),
          getAllChecks(),
        ]);

        const mergedData = checksResponse.map((check, index) => ({
          ...check,
          status: checkStatusesResponse[index],
        }));

        setData(mergedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.toString());
      }
    }
    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <table>
      <thead style={{ color: 'white', fontSize: '24px' }}>
        <tr>
          <th style={cellStyle}>Name</th>
          <th style={cellStyle}>Check Type</th>
          <th style={cellStyle}>Activated</th>
          <th style={cellStyle}>Muted</th>
          <th style={cellStyle}>Tags</th>
          <th style={cellStyle}>Status</th>
          <th style={cellStyle}>Actions</th>
        </tr>
      </thead>
      <tbody style={{ color: 'white', fontSize: '18px' }}>
        {data.map((check) => {
          const status = getStatus(check);
          const statusColor = getStatusColor(status);

          return (
            <tr key={check.id} data-id={check.id}>
              <td style={cellStyle}>{check.name}</td>
              <td style={cellStyle}>{check.checkType}</td>
              <td style={cellStyle}>{check.activated ? 'Yes' : 'No'}</td>
              <td style={cellStyle}>{check.muted ? 'Yes' : 'No'}</td>
              <td style={cellStyle}>{check.tags.join(', ')}</td>
              <td style={{ ...cellStyle, color: statusColor }}>{status}</td>
              <td style={cellStyle}>
                <button
                  style={buttonStyle}
                  data-id={check.id}
                  onClick={() => handleActivate(check.id)}
                >
                  Activate
                </button>
                <button
                  style={buttonStyle}
                  data-id={check.id}
                  onClick={() => handleMute(check.id)}
                >
                  Mute
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ChecksTable;
