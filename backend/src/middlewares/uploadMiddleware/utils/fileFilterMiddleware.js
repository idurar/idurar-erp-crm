const fileFilterMiddleware = ({ type = 'default', mimetype }) => {
  // array containing all the possible file types
  const _fileType = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
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

  if (type === 'default') {
    return true;
  } else {
    let _flag = _fileType.includes(mimetype);

    if (type === 'image') {
      if (!mimetype.startsWith('image/')) {
        _flag = false;
      }
    } else if (type === 'pdf') {
      if (!mimetype.startsWith('application/pdf')) {
        _flag = false;
      }
    } else if (type === 'video') {
      if (!mimetype.startsWith('video/')) {
        _flag = false;
      }
    } else if (type === 'audio') {
      if (!mimetype.startsWith('audio/')) {
        _flag = false;
      }
    } else if (type === 'text') {
      if (
        !mimetype.startsWith('text/') &&
        !mimetype.startsWith('application/vnd.ms-excel') &&
        !mimetype.startsWith('application/msword') &&
        !mimetype.startsWith(
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
      ) {
        _flag = false;
      }
    } else if (type === 'excel') {
      if (
        !mimetype.startsWith('application/vnd.ms-excel') &&
        !mimetype.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      ) {
        _flag = false;
      }
    } else if (type === 'compressed') {
      if (
        !mimetype.startsWith('application/zip') &&
        !mimetype.startsWith('application/x-zip-compressed') &&
        !mimetype.startsWith('application/vnd.rar')
      ) {
        _flag = false;
      }
    }

    if (_flag) {
      return true;
    } else {
      return false;
    }
  }
};

module.exports = fileFilterMiddleware;
