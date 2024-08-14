import { Router } from 'express';
import { getZipfile } from '../controller/zipfile/getZipfile';
import { getFileFromZip } from '../controller/zipfile/getFileFromZip';

const zipfileRouter = Router();

zipfileRouter.get('/zipfile', getZipfile);
zipfileRouter.get('/zipfile/:filePath', getFileFromZip);

export default zipfileRouter;