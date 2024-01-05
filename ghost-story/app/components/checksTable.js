'use client';

import React, { useState, useEffect } from 'react';
import { getAllChecks, getAllCheckStatuses, getAllCheckGroups } from '../api/routes';
import UpdateButton from './updateButton';
import TagsList from './tagsList';
import GroupList from './groupList';

const cellStyle = {
  paddingLeft: '10px',
  paddingRight: '10px',
  paddingTop: '10px',
  border: '1px solid teal',
};

const getStatus = (check) => {
  if (check.activated === false) {
    return 'Deactivated';
  } else if (check.status.hasFailures) {
    return 'Failing';
  } else if (check.status.hasErrors || check.status.isDegraded) {
    return 'Degraded';
  } else {
    return 'Passing';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Deactivated':
      return 'teal';
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
  const [groups, setGroups] = useState(null);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const [checkStatusesResponse, checksResponse, checkGroupsResponse] = await Promise.all([
          getAllCheckStatuses(),
          getAllChecks(),
          getAllCheckGroups(), // Fix the call to fetch groups
        ]);

        const mergedData = checksResponse.map((check, index) => ({
          ...check,
          status: checkStatusesResponse[index],
        }));

        // Map the group data correctly
        setGroups(checkGroupsResponse); 

        setData(mergedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.toString());
      }
    }
    fetchData();
  }, [refreshTrigger]);

  const handleSubmission = () => {
    setRefreshTrigger((prev) => prev + 1); // Trigger a refresh by updating refreshTrigger
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <GroupList groups={groups} />
      <TagsList checks={data} />
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
            const tagsList = check.tags;

            return (
              <tr key={check.id} data-id={check.id}>
                <td style={cellStyle}>{check.name}</td>
                <td style={cellStyle}>{check.checkType}</td>
                <td style={cellStyle}>{check.activated ? 'Yes' : 'No'}</td>
                <td style={cellStyle}>{check.muted ? 'Yes' : 'No'}</td>
                <td style={cellStyle}>{check.tags.join(', ')}</td>
                <td style={{ ...cellStyle, color: statusColor }}>{status}</td>
                <td style={cellStyle}>
                  <UpdateButton
                    checkId={check.id}
                    currentState={check.activated}
                    updateType='activated'
                    onSubmit={handleSubmission}
                  />
                  <UpdateButton
                    checkId={check.id}
                    currentState={check.muted}
                    updateType='muted'
                    onSubmit={handleSubmission}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default ChecksTable;
