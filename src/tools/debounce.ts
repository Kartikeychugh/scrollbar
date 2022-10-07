export const debouncer = () => {
  let timer: any = null;
  return (func: () => void, delay: number) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func();
      timer = null;
    }, delay);
  };
};
