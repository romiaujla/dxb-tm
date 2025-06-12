import { Router } from 'express';
import { InstanceController } from '../controllers/instance.controller';

const router = Router();
const instanceController = new InstanceController();

router.get('/all', async (_, response, next) => {
    try {
        const res = await instanceController.getAll();
        let status = res.status;

        if (status === 200) {
            response.status(status).json(res.body.data);
        } else {
            response.status(status).json(res);
        }

    } catch (error) {
        next(error);
    }
});

router.post('/', async (request, response, next) => {
    try {
        const data = request.body;
        const res = await instanceController.create(data);
        let status = res.status;

        if (status === 200) {
            response.status(status).json(res.body.data);
        } else {
            response.status(status).json(res);
        }

    } catch (error) {
        next(error);
    }

});

router.patch('/:id', async (request, response, next) => {
    try {
        const { id: idString } = request.params;
        const id = parseInt(idString, 10);

        const data = request.body;
        const res = await instanceController.updateById(id, data);
        let status = res.status;

        if (status === 200) {
            response.status(status).json(res.body.data);
        } else {
            response.status(status).json(res);
        }

    } catch (error) {
        next(error);
    }
});

export default router;