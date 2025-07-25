import express from 'express';

import './models/associations'; // Import associations untuk menghindari error saat menggunakan model

import { json } from 'body-parser';
import dotenv from 'dotenv';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler';
import UserRouter from './routes/UserRouter';
import ProfileRouter from './routes/ProfileRouter';
import PostRouter from './routes/PostRouter';
import CommentRouter from './routes/CommentRouter';
import TagRouter from './routes/TagRouter';
import PostTagsRouter from './routes/PostTagsRouter';


dotenv.config();

const app = express();

app.use(json());
app.use(express.urlencoded({ extended: true }));


app.use('/user', UserRouter);
app.use('/profile', ProfileRouter);
app.use('/post', PostRouter);
app.use('/comment', CommentRouter);
app.use('/tag', TagRouter);
app.use('/posttags', PostTagsRouter);
app.use(notFoundHandler);
app.use(errorHandler);  


export default app;