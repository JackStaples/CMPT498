import path from 'path';
import path from 'path';
import { Server } from 'http';
import Express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from './routes';

const app = new Express();
const server = new Server(app);
app.set('view engine', 'ejs');