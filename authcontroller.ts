import { Request, Response } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const SALT_ROUNDS = 10;


export async function register(req: Request, res: Response) {
const { name, email, password } = req.body;
if (!email || !password || !name) return res.status(400).json({ message: 'Missing fields' });


const existing = await prisma.user.findUnique({ where: { email } });
if (existing) return res.status(409).json({ message: 'Email already in use' });


const hash = await bcrypt.hash(password, SALT_ROUNDS);
const user = await prisma.user.create({ data: { name, email, password: hash } });


const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
}


export async function login(req: Request, res: Response) {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ message: 'Missing fields' });


const user = await prisma.user.findUnique({ where: { email } });
if (!user) return res.status(401).json({ message: 'Invalid credentials' });


const ok = await bcrypt.compare(password, user.password);
if (!ok) return res.status(401).json({ message: 'Invalid credentials' });


const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
}
