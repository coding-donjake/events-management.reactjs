const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const addZero = (value: number) => (value < 10 ? `0${value}` : value);

export const fromISOToDate = (value: string) => {
  const date = new Date(value);
  const day = date.getDate().toString().padStart(2, "0");
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
};

export const fromISOToDateInput = (value: string) => {
  const date = new Date(value);
  const year = date.getFullYear().toString().padStart(4, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const fromISOToDateTimeInput = (value: string) => {
  const date = new Date(value);
  const year = date.getFullYear().toString().padStart(4, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = addZero(date.getHours());
  const minutes = addZero(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const fromISOToDateTime12hr = (value: string) => {
  const date = new Date(value);
  const day = addZero(date.getDate());
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hours = addZero(date.getHours() % 12 || 12);
  const minutes = addZero(date.getMinutes());
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  return `${month}-${day}-${year} ${hours}:${minutes} ${ampm}`;
};
