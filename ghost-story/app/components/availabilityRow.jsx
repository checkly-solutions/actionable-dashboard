'use client';

const AvailabilityRow = ({ averageAvailability }) => {
  let displayValue = 'N/A';
  let color = 'grey'; // Default color for 'N/A'

  if (averageAvailability != null) {
    const availabilityNumber = parseFloat(averageAvailability);

    if (availabilityNumber < 95) {
      color = 'red';
    } else if (availabilityNumber >= 95 && availabilityNumber < 99) {
      color = 'yellow';
    } else {
      color = 'green';
    }

    displayValue = averageAvailability; // Set the display value to the actual averageAvailability
  }

  return (
    <div style={{ width: '100%' }}>
      <h3 style={{ color: 'white', fontSize: '24px' }}>Availability:</h3>
      <span style={{ color: color, fontSize: '24px' }}>{displayValue}</span>
    </div>
  );
};

export default AvailabilityRow;

