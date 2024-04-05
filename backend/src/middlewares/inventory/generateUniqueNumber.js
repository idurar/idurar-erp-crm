function generateUniqueNumber(uniqueId, numberLength = 13) {
  const currentDate = new Date();
  const year = (currentDate.getFullYear() % 100).toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const randomNumber = Math.floor(Math.random() * 900) + 100;
  const number = (uniqueId + 1).toString().padStart(numberLength - 9, '0'); // numberLength - 9 , 9 is length day + month + year + randomNumber
  return day + month + year + randomNumber + number;
}

module.exports = generateUniqueNumber;
