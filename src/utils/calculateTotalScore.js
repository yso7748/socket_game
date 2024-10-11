import { getGameAssets } from '../init/assets.js';
// import { getStage, clearStage, setStage } from '../models/stage.model.js';
// import calculateTotalScore from '../utils/calculateTotalScore.js';
// import { getUserItems, initializeItems } from '../models/item.model.js';

const calculateTotalScore = (stages, gameEndTime, isMoveStage, userItems) => {
  let totalScore = 0;

  const { stages: stageData, items: itemData } = getGameAssets();
  const stageTable = stageData.data;

  stages.forEach((stage, index) => {
    let stageEndTime;
    if (index === stages.length - 1) {
      stageEndTime = getEndTime;
    } else {
      stageEndTime = stages[index + 1].timestamp;
    }
    let stageDuration = (stageEndTime - stage.timestamp) / 1000;

    //현재 스테이지의 scorePerSecond를 가져옴
    const stageInfo = stageTable.find((s) => s.id === stage.id);
    const scorePerSecond = stageInfo ? stageInfo.scorePerSecond : 1;

    if (!isMoveStage && index === stages.length - 1) {
      //마지막 스테이지의 경우 버림 처리
      stageDuration = Math.floor(stageDuration);
    } else {
      //중간 스테이지의 경우 반올림 처리
      stageDuration = Math.round(stageDuration);
    }

    totalScore += stageDuration * scorePerSecond;
  });

  //아이템 획득 점수 추가
  userItems.forEach((userItem) => {
    const item = itemData.data.find((item) => item.id === userItem.id);
    if (item) {
      totalScore += item.score;
    }
  });

  return totalScore;
};

export default calculateTotalScore;
