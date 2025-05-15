'use client';
import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';

interface User {
	id: string;
	name: string;
	email: string;
}

interface AuthContextType {
	token: string | null;
	user: User | null;
	isLoading: boolean;
	setAuth: (data: { token: string; user: User }) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context)
		throw new Error('useAuth must be used within an AuthProvider');
	return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const setAuth = (data: { token: string; user: User }) => {
		setToken(data.token);
		setUser(data.user);
		if (typeof window !== 'undefined') {
			localStorage.setItem('token', data.token);
			localStorage.setItem('user', JSON.stringify(data.user));
		}
	};

	const logout = () => {
		setToken(null);
		setUser(null);
		if (typeof window !== 'undefined') {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
		}
		setIsLoading(true);
	};

	useEffect(() => {
		setIsLoading(true);
		if (typeof window !== 'undefined') {
			const token = localStorage.getItem('token');
			const user = localStorage.getItem('user');
			if (token && user) {
				setToken(token);
				setUser(JSON.parse(user));
			}
			setIsLoading(false);
		}
	}, []);

	return (
		<AuthContext.Provider
			value={{ token, user, isLoading, setAuth, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};
