import('dotenv').config({ path: '.env' });
import('dotenv').config({ path: '.env.local' });

import { extname, parse } from 'path';
import { slugify } from 'transliteration';
import fileFilterMiddleware from './utils/fileFilterMiddleware';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const secretAccessKey = process.env.DO_SPACES_SECRET;
const accessKeyId = process.env.DO_SPACES_KEY;
const endpoint = 'https://' + process.env.DO_SPACES_URL;
const region = process.env.REGION;

const clientParams = {
  endpoint: endpoint,
  region: region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
};

const DoSingleStorage = ({
  entity,
  fileType = 'default',
  uploadFieldName = 'file',
  fieldName = 'file',
}) => {
  return async function (req, res, next) {
    if (!req.files || Object.keys(req.files)?.length === 0 || !req.files?.file) {
      req.body[fieldName] = null;
      next();
    } else {
      const s3Client = new S3Client(clientParams);

      try {
        if (!fileFilterMiddleware({ type: fileType, mimetype: req.files.file.mimetype })) {
          // skip upload if File type not supported
          throw new Error('Uploaded file type not supported');
          // next();
        }
        let fileExtension = extname(req.files.file.name);
        const fileNameWithoutExt = parse(req.files.file.name).name;

        let uniqueFileID = Math.random().toString(36).slice(2, 7); // generates unique ID of length 5

        let originalname = '';
        if (req.body.seotitle) {
          originalname = slugify(req.body.seotitle.toLocaleLowerCase()); // convert any language to English characters
        } else {
          originalname = slugify(fileNameWithoutExt.toLocaleLowerCase()); // convert any language to English characters
        }

        let _fileName = `${originalname}-${uniqueFileID}${fileExtension}`;

        const filePath = `public/uploads/${entity}/${_fileName}`;

        let uploadParams = {
          Key: `${filePath}`,
          Bucket: process.env.DO_SPACES_NAME,
          ACL: 'public-read',
          Body: req.files.file.data,
        };
        const command = new PutObjectCommand(uploadParams);
        const s3response = await s3Client.send(command);

        if (s3response.$metadata.httpStatusCode === 200) {
          // saving file name and extension in request upload object
          req.upload = {
            fileName: _fileName,
            fieldExt: fileExtension,
            entity: entity,
            fieldName: fieldName,
            fileType: fileType,
            filePath: filePath,
          };

          req.body[fieldName] = filePath;
          next();
        }
      } catch (error) {
        return res.status(403).json({
          success: false,
          result: null,
          controller: 'DoSingleStorage.js',
          message: 'Error on uploading file',
        });
      }
    }
  };
};

export default DoSingleStorage;
