import { ObjectNameEnum } from 'dxb-tm-core/src/core/enums';
import { Router } from 'express';
import { InstanceController } from '../controllers/instanceController';

const router = Router();
const instanceController = new InstanceController();

router.post('/instance', async (req, _, next) => {
    console.log('request body:', req.body);
    await instanceController.create(req.body, ObjectNameEnum.INSTANCE).catch(next);
});