import { Request, Response } from 'express';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'admin').trim();
  const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || 'adminpassword123').trim();

  const enteredUser = (username || '').trim();
  const enteredPass = (password || '').trim();

  if (enteredUser === ADMIN_USERNAME && enteredPass === ADMIN_PASSWORD) {
    return res.json({ 
      success: true,
      token: 'active_session', // Static token for the session
      user: { username: ADMIN_USERNAME } 
    });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
};

export const getMe = (req: any, res: Response) => {
  res.json({ username: process.env.ADMIN_USERNAME || 'admin' });
};
