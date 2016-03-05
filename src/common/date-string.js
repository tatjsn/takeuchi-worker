const twoDigits = num => ('0' + num).slice(-2);

export default () => {
  const date = new Date();
  return [
    date.getFullYear(),
    twoDigits(date.getMonth() + 1),
    twoDigits(date.getDate())
  ].join('-');
}
