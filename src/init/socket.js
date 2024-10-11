import { Server as SocketIO } from 'socket.io';
import registerHandler from '../handlers/regiser.handler.js';
// import { server } from 'typescript';

const initSocket = (server) => {
  const io = new SocketIO();
  io.attach(server);

  registerHandler(io);
};

export default initSocket;
