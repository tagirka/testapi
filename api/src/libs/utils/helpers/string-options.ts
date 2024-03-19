export const replacePoint = (value: string, delimiter = ','): string => {
  return value.replace(/\./g, delimiter);
};

export const replaceComma = (value: string, delimiter = '.'): string => {
  return value.replace(/\,/g, delimiter);
};
