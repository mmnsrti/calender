export const cc = (...classes: unknown[]) => {
  return classes.filter(c=>typeof c === 'string').join(' ')
};
 