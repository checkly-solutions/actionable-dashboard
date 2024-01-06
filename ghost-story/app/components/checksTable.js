'use client';

import React, { useState, useEffect } from 'react';
import {
  getAllChecks,
  getAllCheckStatuses,
  getAllCheckGroups,
  getAnalyticsApi,
  getAnalyticsBrowser,
} from '../api/routes';
import UpdateButton from './updateButton';
import TagsList from './tagsList';
import GroupList from './groupList';
import { getStatus, getStatusColor } from '../utils/statusUtils';
import styles from '../page.module.css';

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
          <tr className={styles.cellStyle}>
            <th className={styles.cellStyle}>Name</th>
            <th className={styles.cellStyle}>Check Type</th>
            <th className={styles.cellStyle}>Activated</th>
            <th className={styles.cellStyle}>Muted</th>
            <th className={styles.cellStyle}>Tags</th>
            <th className={styles.cellStyle}>Availability</th>
            <th className={styles.cellStyle}>Status</th>
            <th className={styles.cellStyle}>Actions</th>
          </tr>
        </thead>
        <tbody style={{ color: 'white', fontSize: '18px' }}>
          {filteredData.map((check) => {
            const status = getStatus(check);
            const statusColor = getStatusColor(status);

            return (
              <tr className={styles.cellStyle} key={check.id} data-id={check.id}>
                <td className={styles.cellStyle}>{check.name}</td>
                <td className={styles.cellStyle}>{check.checkType}</td>
                <td className={styles.cellStyle}>{check.activated ? 'Yes' : 'No'}</td>
                <td className={styles.cellStyle}>{check.muted ? 'Yes' : 'No'}</td>
                <td className={styles.cellStyle}>{check.tags.join(', ')}</td>
                <td className={styles.cellStyle}>
                  {check.checkType === 'MULTI_STEP'
                    ? 'n/a'
                    : check.analytics && (
                        <div>
                          <span style={{ color: statusColor }}>
                            {check.analytics.series[0].data[0].availability}
                          </span>
                        </div>
                      )}
                </td>

                <td className={styles.cellStyle} style={{ color: statusColor }}>
                  {status}
                </td>
                <td className={styles.cellStyle}>
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
