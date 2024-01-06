import downloadPdf from '#handlers/downloadHandler/downloadPdf';
import express from 'express';
import { hasPermission } from '@/middlewares/permission';

const router = express.Router();

router.route('/:directory/:file').get((req, res) => {
  try {
    const { directory, file } = req.params;
    const id = file.slice(directory.length + 1).slice(0, -4); // extract id from file name
    downloadPdf(req, res, { directory, id });
  } catch (error) {
    res.status(503).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
  }
});

export default router;
