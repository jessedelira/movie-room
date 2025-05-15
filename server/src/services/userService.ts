export interface User {
	id: string;
	name: string;
}

import prisma from '../db/prisma';

export const getAllUsers = async (): Promise<User[]> => prisma.user.findMany();

export const getUserById = async (id: string): Promise<User | null> =>
	prisma.user.findUnique({ where: { id } });
