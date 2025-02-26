import { type Request, type Response } from 'express';
import User from '../models/User';
import { checkPassword, hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';
import { generateJWT } from '../utils/jwt';

export class AuthController {

  static createAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Prevenir duplicados
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      const error = new Error('A user with that email is already registered.');
      res.status(409).json({ error: error.message });
      return;
    }

    try {
      const user = new User(req.body);
      user.password = await hashPassword(password);
      user.token = generateToken();
      await user.save();

      await AuthEmail.sendConfirmationEmail({
        name: user.name,
        email: user.email,
        token: user.token
      });

      res.json('Account created successfully.');
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const user = await User.findOne({ where: { token } });

      if (!user) {
        const error = new Error('Invalid token');
        res.status(401).json({ error: error.message });
        return;
      }

      user.confirm = true;
      user.token = null;

      await user.save();

      res.json('Account confirmed successfully.');
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Revisar que el usuario exista
      const user = await User.findOne({ where: { email } });
      if (!user) {
        const error = new Error('User not found.');
        res.status(404).json({ error: error.message });
        return;
      }

      // Revisar si el usuario tiene la cuenta confirmada
      if (!user.confirm) {
        const error = new Error('Account not confirmed.');
        res.status(403).json({ error: error.message });
        return;
      }

      // Revisar si el password es correcto
      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error('Invalid Credentials.');
        res.status(401).json({ error: error.message });
        return;
      }

      // Retornar el JWT
      const token = generateJWT(user.id);

      res.json(token);
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Revisar que el usuario exista
      const user = await User.findOne({ where: { email } });
      if (!user) {
        const error = new Error('User not found.');
        res.status(404).json({ error: error.message });
        return;
      }

      user.token = generateToken();

      await user.save();
      await AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: user.token
      });

      res.json('Please check your email for instructions.');
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExists = await User.findOne({ where: { token } });

      if (!tokenExists) {
        const error = new Error('Invalid Token');
        res.status(401).json({ error: error.message });
        return;
      }

      res.json(tokenExists);
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static resetPasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const user = await User.findOne({ where: { token } });
      if (!user) {
        const error = new Error('Invalid Token');
        res.status(401).json({ error: error.message });
        return;
      }

      // Asignar el nuevo password
      user.password = await hashPassword(password);
      user.token = null;
      await user.save();

      res.json('Password updated successfully')

    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static user = async (req: Request, res: Response) => {
    try {
      res.json(req.user);
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static updateCurrentUserPassword = async (req: Request, res: Response) => {
    try {
      const { current_password, password } = req.body;
      const { id } = req.user;

      const user = await User.findByPk(id);
      const isPasswordCorrect = await checkPassword(current_password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error('Invalid Credentials');
        res.status(401).json({ error: error.message });
        return;
      }

      user.password = await hashPassword(password);
      await user.save();

      res.json('Password updated successfully');
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static checkPassword = async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      const { id } = req.user;

      const user = await User.findByPk(id);
      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error('Invalid Credentials');
        res.status(401).json({ error: error.message });
        return;
      }

      res.json('Password correct!');
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}