import { Router } from 'express';
import { Request, Response } from 'express';
import * as ApiBitrix from '../app/controllers/apiBitrix.controller';
const apiRouter = Router();
// Vì Bitrix24 không xây dựng API theo kiểu RESTful hiện đại, mà theo mô hình RPC (Remote Procedure Call)
//— nơi bạn gọi một “hàm” từ xa với tên và tham số, chứ không thao tác trên tài nguyên theo chuẩn REST.
//gọi từ client lên server bằng post vì payload sẽ lớn
apiRouter.post('/call/:action', ApiBitrix.callApiAnyBitrix);

export default apiRouter;
