import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService';

export const requireAuth = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;

	if (!authHeader?.startsWith('Bearer ')) {
		res.status(401).json({
			message: 'Missing or invalid Authorization header',
		});
		return;
	}

	const token = authHeader.split(' ')[1];
	const payload = verifyToken(token);

	if (!payload) {
		res.status(401).json({ message: 'Invalid or expired token' });
		return;
	}

	next();
};
