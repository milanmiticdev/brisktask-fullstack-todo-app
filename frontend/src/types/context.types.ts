export interface AuthContext {
	userId: number;
	userRole: string;
	token: string;
	login: (id: number, role: string, token: string, expirationDate: Date | null) => void;
	logout: () => void;
}
