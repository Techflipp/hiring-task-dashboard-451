export const UpdateUrlQuery = (url: string, key: string, value: string) => {
  const searchParams = new URLSearchParams(url.split("?")[1]);
  searchParams.set(key, value);
  return `${url.split("?")[0]}?${searchParams.toString()}`;
};
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};
export const dateParser = (dateString: string): Date => {
  const adjustedDateString = dateString.replace(" ", "T");
  const date = new Date(adjustedDateString);
  return date;
};
export const dateDecoder = (dateString: string): string => {
  const modifiedString = dateString.replace(/T.*Z/g, "");
  return modifiedString;
};
export const decodeUri = (value: string) => {
  return decodeURIComponent(value);
};
