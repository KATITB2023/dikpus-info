export const getDate = (fullDate: Date) => {
  return fullDate.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

export const getTwoTime = (startDate: Date, endDate: Date) => {
  const startTime = startDate.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  });
  const endTime = endDate.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return `${startTime} - ${endTime}`;
};

export const validTime = (startTime: Date, endTime: Date) => {
  const currentTime = new Date();

  return currentTime >= startTime && currentTime <= endTime;
};
