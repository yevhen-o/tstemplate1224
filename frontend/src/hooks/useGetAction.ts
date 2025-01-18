export const useGetAction = () => {
  const controller = new AbortController();
  const signal = controller.signal;
  return signal;
};
