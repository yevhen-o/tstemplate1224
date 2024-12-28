export const formatDate = (date: string) => {
  const instance = new Date(date);
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "short",
  }).format(instance);
};
