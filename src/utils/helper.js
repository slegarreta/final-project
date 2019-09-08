export const stripWhateSpace = (string) => {
  string = string.replace(/\s+/g, '-').toLowerCase();
  return string;
}

export const generateKey = (index) => {
    return `${index}_${new Date().getTime()}`;
};
