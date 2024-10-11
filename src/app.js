import express from 'express';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';
import { hostname } from 'os';
import redisClient from './init/redis.js';

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
initSocket(server);

app.get('/', (req, res) => {
  res.send('hello world');
});

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    const assets = await loadGameAssets();
    console.log('Assets loaded successfully');
    if (!redisClient.status || redisClient.status !== 'connect') {
      await redisClient.connect();
    }
  } catch (error) {
    console.error('Failed to initialize game', error);
  }
});
