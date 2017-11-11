const string = {}
string.isNullOrEmpty = (str) => {
  if (str === '' || str === undefined || str === null) {
    return true;
  }
  return false;
}
export default string;
