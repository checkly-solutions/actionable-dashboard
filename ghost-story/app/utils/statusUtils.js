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
