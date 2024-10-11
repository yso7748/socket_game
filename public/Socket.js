import { CLIENT_VERSION } from './Constants.js';

let userId = '';
let scoreInstance = null; // Score 인스턴스를 저장할 변수

const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
    userId,
  },
});

socket.on('response', (data) => {
  console.log(data);
});

socket.on('newHighScore', (data) => {
  console.log(`highScore: ${data.uuid}, score: ${data.score}`);
  if (scoreInstance && data.score) {
    scoreInstance.setHighScore(data.score);
  }
});

socket.on('connection', (data) => {
  console.log('connection: ', data);
  userId = data.uuid;
  if (scoreInstance && data.highScore) {
    scoreInstance.setHighScore(data.highScore.score);
  }
});

const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

const setScoreInstance = (instance) => {
  scoreInstance = instance;
};

export { sendEvent, setScoreInstance };
