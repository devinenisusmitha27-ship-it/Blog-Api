import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


interface TokenPayload { id: number; email: string; role: string }


export interface AuthRequest extends Request {
user?: TokenPayload;
}


export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
const header = req.headers.authorization;
if (!header) return res.status(401).json({ message: 'Missing authorization header' });


const token = header.split(' ')[1];
if (!token) return res.status(401).json({ message: 'Invalid token' });


try {
const secret = process.env.JWT_SECRET as string;
const payload = jwt.verify(token, secret) as TokenPayload;
req.user = payload;
next();
} catch (err) {
return res.status(401).json({ message: 'Invalid or expired token' });
}
}


export function requireRole(role: string) {
return (req: AuthRequest, res: Response, next: NextFunction) => {
if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
next();
};
}
