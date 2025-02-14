import { Router } from "express";
import { body } from 'express-validator'
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";
import { limiter } from "../config/limiter";

const router = Router();

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
    limiter,
    body('token')
        .notEmpty().withMessage('Token no valido')
        .isLength({ min: 6, max: 6 }).withMessage('Token no valido'),
    handleInputErrors,
    AuthController.confirmAccount
);

export default router;