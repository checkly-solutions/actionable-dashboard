export const getStatus = (check) => {
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

export const getStatusColor = (status) => {
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

export const calculateAverageAvailability = (data) => {
  let totalAvailability = 0;
  let count = 0;

  data.forEach((check) => {
    if (check.analytics && check.analytics.series[0].data[0].availability != null) {
      totalAvailability += check.analytics.series[0].data[0].availability;
      count += 1;
    }
  });

  return count > 0 ? (totalAvailability / count).toFixed(2) : 0; // toFixed(2) for two decimal places
};
