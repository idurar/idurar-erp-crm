import axios from 'axios';
export default async function checkImage(path) {
  axios
    .get(path)
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}
