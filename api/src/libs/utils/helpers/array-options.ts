export const getUniqueArray = (arr): any[] => {
  return arr.filter((el, ind) => ind === arr.indexOf(el));
};
