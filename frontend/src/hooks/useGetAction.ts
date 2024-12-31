export const useGetAction = (action: any) => {
  const controller = new AbortController();
  const signal = controller.signal;
  return signal;
};
