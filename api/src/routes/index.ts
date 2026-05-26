import { Router } from 'express';
import { carRouter }        from './car.route';
import { serviceRouter }    from './service.route';
import { inquiryRouter }    from './inquiry.route';
import { newsletterRouter } from './newsletter.route';
import { authRouter, userRouter } from './auth.route';
import { settingsRouter } from './settings.route';
export const router = Router();

router.use('/cars',       carRouter);
router.use('/services',   serviceRouter);
router.use('/inquiries',  inquiryRouter);
router.use('/newsletter', newsletterRouter);
router.use('/auth',       authRouter);
router.use('/users',      userRouter);
router.use('/settings',   settingsRouter);
