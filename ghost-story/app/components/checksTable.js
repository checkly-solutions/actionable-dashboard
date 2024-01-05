'use client';

import React, { useState, useEffect } from 'react';
import { getAllChecks, getAllCheckStatuses, getAllCheckGroups } from '../api/routes';
import UpdateButton from './updateButton';
import TagsList from './tagsList';
import GroupList from './groupList';
import styles from '../page.module.css';

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

const ChecksTable = () => {
  const [data, setData] = useState(null);
  const [groups, setGroups] = useState(null);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);

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

  const handleTagClick = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  const filteredData = data
    ? data.filter(
        (check) =>
          selectedTags.length === 0 ||
          selectedTags.some((tag) => check.tags && check.tags.includes(tag))
      )
    : [];

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
      <TagsList checks={data} onTagClick={handleTagClick} selectedTags={selectedTags} />
      <table>
        <thead style={{ color: 'white', fontSize: '24px' }}>
          <tr className='cellStyle'>
            <th>Name</th>
            <th>Check Type</th>
            <th>Activated</th>
            <th>Muted</th>
            <th>Tags</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody style={{ color: 'white', fontSize: '18px' }}>
          {filteredData.map((check) => {
            const status = getStatus(check);
            const statusColor = getStatusColor(status);

            return (
              <tr className='cellStyle' key={check.id} data-id={check.id}>
                <td>{check.name}</td>
                <td>{check.checkType}</td>
                <td>{check.activated ? 'Yes' : 'No'}</td>
                <td>{check.muted ? 'Yes' : 'No'}</td>
                <td>{check.tags.join(', ')}</td>
                <td style={{ color: statusColor }}>{status}</td>
                <td>
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
};

export default ChecksTable;
