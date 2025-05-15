'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { login } from '@/api/login';

const Login = () => {
	const { setAuth, isLoading, user } = useAuth();
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		const formData = new FormData(e.currentTarget);
		const email = formData.get('email');
		const password = formData.get('password');
		try {
			const { token, user } = await login(email, password);
			if (token && user) {
				setAuth({ token: token, user: user });
				router.push('/home');
			} else {
				setError('Invalid credentials');
			}
		} catch {
			setError('Login failed');
		}
	};

	useEffect(() => {
		if (!isLoading && user) {
			router.push('/home');
		}
	});
	console.log('isLoading', isLoading);
	console.log('user', user);

	if (isLoading) return null;
	if (!isLoading && user) return null;

	return (
		<div className="flex min-h-screen flex-col items-center justify-center">
			<form
				className="flex w-80 flex-col gap-2 rounded border bg-white p-4"
				onSubmit={handleLogin}
			>
				<label>Email</label>
				<input
					type="email"
					placeholder="Email"
					className="rounded border p-2"
					name="email"
				/>
				<label htmlFor="password">Password</label>
				<input
					type="password"
					placeholder="Password"
					className="rounded border p-2"
					name="password"
				/>
				<button
					type="submit"
					className="mt-2 rounded border bg-gray-200 p-2"
				>
					Login
				</button>
				{error && <div className="mt-2 text-red-600">{error}</div>}
			</form>
		</div>
	);
};

export default Login;
