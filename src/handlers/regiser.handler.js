import { addUser, getUserById } from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid';
// import { handlerEvent } from './helper.js';
import { handleConnection, handleDisconnect, handleEvent } from './helper.js';
// import { getUserById } from '../models/user.model.js';

const registerHandler = (io) => {
  io.on('connection', async (socket) => {
    let user = {};
    if (socket.handshake.query.userId) {
      user = await getUserById(socket.userId);

      if (!user) {
        user = {};
        user.uuid = socket.handshake.query.userId;
      }
      user.socketId = socket.id;
    } else {
      user.uuid = uuidv4();
      user.socketId = socket.id;
    }
    await addUser(user);

    await handleConnection(socket, user.uuid);

    socket.on('event', (data) => handleEvent(io, socket, data));

    socket.on('disconnect', () => handleConnection(socket, user.uuid));
  });
};

export default registerHandler;
