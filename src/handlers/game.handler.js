import { getStage, clearStage, setStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';
import calculateTotalScore from '../utils/calculateTotalScore.js';
import { getUserItems, initializeItems } from '../models/item.model.js';
import { addHighScore, getHighScores } from '../models/score.model.js';

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();
  clearStage(uuid);
  initializeItems(uuid);
  setStage(uuid, stages.data[0].id, payload.timestamp);

  return { status: 'success', handler: 2 };
};

export const gameEnd = async (uuid, payload, io) => {
  // 클라이언트에서 받은 게임 종료 시 타임스탬프와 총 점수
  const { timestamp: gameEndTime, score } = payload;
  const stages = getStage(uuid);
  const userItems = getUserItems(uuid);

  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 총 점수 계산
  const totalScore = calculateTotalScore(stages, gameEndTime, false, userItems);

  // 점수와 타임스탬프 검증 (예: 클라이언트가 보낸 총점과 계산된 총점 비교)
  if (Math.abs(totalScore - score) > 1) {
    return { status: 'fail', message: 'Score verification failed' };
  }

  // 현재 최고 점수를 가져와서 비교
  const highScores = await getHighScores(1);
  const currentHighScore = highScores.length > 0 ? highScores[0].score : 0;

  if (score > currentHighScore) {
    // 새로운 최고 점수인 경우
    await addHighScore(uuid, score);

    io.emit('newHighScore', { uuid, score });
  }

  // 검증이 통과되면 게임 종료 처리
  return { status: 'success', message: 'Game ended successfully', score, handler: 3 };
};
