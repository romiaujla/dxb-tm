import { Router } from 'express';
import { InstanceController } from '../controllers/instanceController';

const router = Router();
const instanceController = new InstanceController();

router.get('/', async (_, response) => {
    response.status(200).json({ message: 'GET /instances - Working' });
});

router.post('/', async (request, response, next) => {
    try {
        const data = request.body;
        const res = await instanceController.create(data);

        response.status(200).json(res);
    } catch (error) {
        next(error);
    }

});

export default router;