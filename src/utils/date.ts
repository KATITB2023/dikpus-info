export const getDate = (fullDate: Date) => {
  const date = new Date(fullDate);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getTwoTime = (startDate: Date, endDate: Date) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startTime = start.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const endTime = end.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `${startTime} - ${endTime}`;
};

export const validTime = (startTime: Date, endTime: Date) => {
  const currentTime = new Date(Date.now());
  return currentTime > startTime && currentTime < endTime;
};
