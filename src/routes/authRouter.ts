import { Router } from "express";
import { body, param } from 'express-validator'
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";
import { limiter } from "../config/limiter";

const router = Router();

router.use(limiter);

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe ser mínimo 8 caracteres.'),
    body('email')
        .isEmail().withMessage('Email no valido'),
    handleInputErrors,
    AuthController.createAccount
);

router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('Token no valido')
        .isLength({ min: 6, max: 6 }).withMessage('Token no valido'),
    handleInputErrors,
    AuthController.confirmAccount
);

router.post('/login',
    body('email')
        .isEmail().withMessage('Email no valido'),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),
    handleInputErrors,
    AuthController.login
);

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('Email no valido'),
    handleInputErrors,
    AuthController.forgotPassword
);

router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('Token no valido')
        .isLength({ min: 6, max: 6 }).withMessage('Token no valido'),
    handleInputErrors,
    AuthController.validateToken
);

router.post('/reset-password/:token',
    param('token')
        .notEmpty().withMessage('Token no valido')
        .isLength({ min: 6, max: 6 }).withMessage('Token no valido'),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe ser mínimo 8 caracteres.'),
    handleInputErrors,
    AuthController.resetPasswordWithToken
);

export default router;