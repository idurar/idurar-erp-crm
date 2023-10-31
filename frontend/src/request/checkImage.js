import axios from 'axios';
export default async function checkImage(path) {
  const result = await axios
    .get(path)
    .then((response) => {
      if (response.status === 200) return true;
      else return false;
    })
    .catch(() => {
      return false;
    });

  return result;
}
