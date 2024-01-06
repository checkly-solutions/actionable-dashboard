'use client';

import React, { useState, useEffect } from 'react';
import {
  getAllChecks,
  getAllCheckStatuses,
  getAllCheckGroups,
  getAnalyticsApi,
  getAnalyticsBrowser,
} from '../api/routes';
import TableRow from './tableRow';
import TagsList from './tagsList';
import GroupList from './groupList';
//stub data
import checkData from '../data/check.json'
import statusData from '../data/status.json'
import groupData from '../data/group.json'


const ChecksTable = () => {
  const [data, setData] = useState(null);
  const [groups, setGroups] = useState(null);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const headerTitles = [
    'Name',
    'Check Type',
    'Activated',
    'Muted',
    'Tags',
    'Availability',
    'Status',
    'Actions',
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const [checkStatusesResponse, checksResponse, checkGroupsResponse] = await Promise.all([
          getAllCheckStatuses(),
          getAllChecks(),
          getAllCheckGroups(),
        ]);

        const mergedDataWithStatus = checksResponse.map((check, index) => ({
          ...check,
          status: checkStatusesResponse[index],
        }));

        const mergedDataWithAnalytics = await Promise.all(
          mergedDataWithStatus.map(async (check) => {
            let analyticsData = null;

            if (check.checkType === 'BROWSER') {
              analyticsData = await getAnalyticsBrowser(check.id);
            } else if (check.checkType === 'API') {
              analyticsData = await getAnalyticsApi(check.id);
            }

            return { ...check, analytics: analyticsData };
          })
        );

        setGroups(checkGroupsResponse);
        setData(mergedDataWithAnalytics);
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
          <TableRow rowData={headerTitles} isHeader />
        </thead>
        <tbody style={{ color: 'white', fontSize: '18px' }}>
          {filteredData.map((check) => (
            <TableRow key={check.id} rowData={check} handleSubmission={handleSubmission} />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ChecksTable;
