const fileFilter = (req, file, cb) => {
  // array containing all the possible file types
  const _fileType = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/msword',
    'text/plain',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/pdf',
    'application/zip',
    'application/vnd.rar',
    'video/mp4',
    'video/x-msvideo',
    'audio/mpeg',
    'video/webm',
  ];

  let _flag = _fileType.includes(file.mimetype);

  if (_flag) {
    return cb(null, true);
  } else {
    return cb(new Error(`${file.mimetype} File type not supported!`));
  }
};

module.exports = fileFilter;
