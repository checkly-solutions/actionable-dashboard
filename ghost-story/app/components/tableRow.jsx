'use client';

import styles from '../page.module.css';
import UpdateButton from './updateButton'; // Adjust import path as needed
import { getStatus, getStatusColor } from '../utils/statusUtils'; // Import your utility functions

const TableRow = ({ rowData, isHeader, handleSubmission }) => {
  if (isHeader) {
    // Assuming rowData is an array for headers
    return (
      <tr className={styles.cellStyle}>
        {rowData.map((header) => (
          <th key={header} className={styles.cellStyle}>
            {header}
          </th>
        ))}
      </tr>
    );
  } else {
    return (
      <tr className={styles.cellStyle} key={rowData.id} data-id={rowData.id}>
        <td className={styles.cellStyle}>{rowData.name}</td>
        <td className={styles.cellStyle}>{rowData.checkType}</td>
        <td className={styles.cellStyle}>{rowData.activated ? 'Yes' : 'No'}</td>
        <td className={styles.cellStyle}>{rowData.muted ? 'Yes' : 'No'}</td>
        <td className={styles.cellStyle}>{rowData.tags} </td>
        <td className={styles.cellStyle}>
          {rowData.checkType === 'MULTI_STEP' ? (
            'n/a'
          ) : (
            <span style={{ color: 'white' }}>
              {rowData.analytics && rowData.analytics.series[0].data[0].availability}
            </span>
          )}
        </td>
        <td className={styles.cellStyle} style={{ color: getStatusColor(getStatus(rowData)) }}>
          {getStatus(rowData)}
        </td>
        <td className={styles.cellStyle}>
          <UpdateButton
            checkId={rowData.id}
            currentState={rowData.activated}
            updateType='activated'
            onSubmit={handleSubmission}
          />
          <UpdateButton
            checkId={rowData.id}
            currentState={rowData.muted}
            updateType='muted'
            onSubmit={handleSubmission}
          />
        </td>
      </tr>
    );
  }
};
export default TableRow;
