import { User } from '@prisma/client';
import prisma from '../db/prisma';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

export interface AuthPayload {
	userId: string;
	email: string;
}

const AuthPayloadSchema = z.object({
	userId: z.string(),
	email: z.string().email(),
});

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export const registerUser = async (
	name: string,
	email: string,
	password: string,
): Promise<User> => {
	console.log('Registering user:', { name, email });
	const hashedPassword = await argon2.hash(password);
	console.log('Hashed password:', hashedPassword);
	const user = await prisma.user.create({
		data: { name, email, password: hashedPassword },
	});
	console.log('User created:', user);
	return user;
};

export const authenticateUser = async (
	email: string,
	password: string,
): Promise<{ user: User; token: string } | null> => {
	const user = await prisma.user.findUnique({ where: { email } });
	console.log(user, 'user')
	if (!user) return null;
	const valid = await argon2.verify(user.password, password);
	if (!valid) return null;
	const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
		expiresIn: '1h',
	});

	return { user, token };
};

export const verifyToken = (token: string): AuthPayload | null => {
	try {
		const payload = jwt.verify(token, JWT_SECRET);
		const result = AuthPayloadSchema.safeParse(payload);
		if (result.success) {
			return result.data;
		}
		return null;
	} catch {
		return null;
	}
};
