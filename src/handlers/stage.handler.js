import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';
import { getUserItems } from '../models/item.model.js';
import calculateTotalScore from '../utils/calculateTotalScore.js';

export const moveStageHandler = (userId, payload) => {
  //유저의 현재 스테이지정보

  let currentStages = getStage(userId);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  //오름차순 -> 가장 큰 스테이지 ID를 확인 <ㅡ 유저의 현재 스테이지

  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  //클라이언트 vs서버 비교

  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current Stage mismatch' };
  }

  const { stages } = getGameAssets();

  const currentStageInfo = stages.data.find((stage) => stage.id === payload.currentStage);
  if (!currentStageInfo) {
    return { status: 'fail', message: 'Current stage info not found' };
  }

  const targetStageInfo = stages.data.find((stage) => stage.id === payload.targetStage);
  if (!targetStageInfo) {
    return { status: 'fail', message: 'Target stage info not found' };
  }

  //점수 검증
  const serverTime = Date.now();
  const userItems = getUserItems(userId);
  const totalScore = calculateTotalScore(currentStage, serverTime, true, userItems);

  if (targetStageInfo.score > totalScore) {
    return { status: 'fail', message: 'Invalid elapsed time' };
  }
  // const elapsedTime = (serverTime - currentStage.timestamp) / 1000;

  //1스테이지에서 ->2스테이지로 넘어가는 과정
  // 5 => 임의로 정한 오차범위
  // if (elapsedTime < 10 || elapsedTime > 10.5) {
  //   return { status: 'fail', message: 'Invalid elapsed time' };
  // }

  setStage(userId, payload.targetStage, serverTime);
  return { status: 'success', handler: 11 };
};
