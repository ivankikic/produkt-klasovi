import express, {json} from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import usersRouter from './routes/users_routes.js';
import documentsRouter from './routes/documents_routes.js';
import authRouter from './routes/auth_routes.js';

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 5000;
const corsOptions = {
    origin: process.env.URL || '*',
    credentials: true,
    optionsSuccessStatus: 200
};
// middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

//app.use('/', express.static(join(__dirname, 'public')));
app.use('/api/users', usersRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/auth', authRouter);

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
});