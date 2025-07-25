import express from 'express';

import './models/associations'; // Import associations untuk menghindari error saat menggunakan model

import { json } from 'body-parser';
import dotenv from 'dotenv';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler';
import UserRouter from './routes/UserRouter';
import ProfileRouter from './routes/ProfileRouter';
import CategoryRouter from './routes/CategoryRouter';
import PostRouter from './routes/PostRouter';
import TagRouter from './routes/TagRouter';
import PostTagRouter from './routes/PostTagRouter';
import CommentRouter from './routes/CommentRouter';
import MediaRouter from './routes/MediaRouter';


dotenv.config();

const app = express();

app.use(json());
app.use(express.urlencoded({ extended: true }));


app.use('/user', UserRouter);
app.use('/profile', ProfileRouter);
app.use('/category', CategoryRouter);
app.use('/post', PostRouter);
app.use('/tag', TagRouter);
app.use('/posttag', PostTagRouter);
app.use('/comment', CommentRouter);
app.use('/media', MediaRouter);
app.use(notFoundHandler);
app.use(errorHandler);  


export default app;