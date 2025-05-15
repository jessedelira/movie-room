export const login = async (
	email: FormDataEntryValue | null,
	password: FormDataEntryValue | null,
) => {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		});

		const json = await response.json();
		return { token: json.token, user: json.user };
	} catch (e: unknown) {
		throw e;
	}
};
