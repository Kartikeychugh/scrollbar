export const translateClientToScrollDistance = (
  clientDistance: number,
  clientHeight: number,
  scrollHeight: number
) => (scrollHeight / clientHeight) * clientDistance;

export const translateScrollToClientDistance = (
  clientDistance: number,
  clientHeight: number,
  scrollHeight: number
) => (scrollHeight / clientHeight) * clientDistance;
