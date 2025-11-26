import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth';
import slugify from 'slugify';


export async function listPosts(req: Request, res: Response) {
const posts = await prisma.post.findMany({
where: { published: true },
include: { author: true, tags: true, category: true, comments: true }
});
res.json(posts);
}


export async function createPost(req: AuthRequest, res: Response) {
const { title, content, tagNames = [], categoryName, published = false } = req.body;
if (!req.user) return res.status(401).json({ message: 'Unauthorized' });


// upsert category
let category = null;
if (categoryName) {
category = await prisma.category.upsert({
where: { name: categoryName },
update: {},
create: { name: categoryName }
});
}


// connect or create tags
const tags = await Promise.all(tagNames.map(async (t: string) => {
return prisma.tag.upsert({ where: { name: t }, update: {}, create: { name: t } });
}));


const slug = slugify(title, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-4);


const post = await prisma.post.create({
data: {
title,
content,
slug,
published,
author: { connect: { id: req.user.id } },
category: category ? { connect: { id: category.id } } : undefined,
tags: { connect: tags.map(t => ({ id: t.id }))
