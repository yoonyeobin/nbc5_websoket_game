import { sendEvent } from './Socket.js'
import assetsData from './assets/assets.js'

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  currentStage = 1000;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    // 현재 스테이지 데이터 찾기
    const currentStageData = assetsData.stageData.data.find(stage => stage.id === this.currentStage);

    const scorePerSecond = currentStageData.scorePerSecond;

    this.score += deltaTime * 0.001 * scorePerSecond;

    // 점수가 목표점수 이상이 될 시 서버에 메세지 전송
    this.stageChange(10, 1000, 1001);
    this.stageChange(30, 1001, 1002);
    this.stageChange(50, 1002, 1003);
    this.stageChange(100, 1003, 1004);
    this.stageChange(200, 1004, 1005);
    this.stageChange(300, 1005, 1006);
  }

  stageChange(targetScore, currentStage, targetStage) {
    if (Math.floor(this.score) >= targetScore && this.currentStage === currentStage) {
      sendEvent(11, { currentStage: this.currentStage, targetStage: targetStage });
      this.currentStage = targetStage; // 스테이지 업데이트
    }
  }

  getItem(itemId) {
    const item = assetsData.itemData.data.find(item => item.id === itemId)
    const itemScore = item.score;

    this.score += itemScore;

    // 점수가 목표점수 이상이 될 시 서버에 메세지 전송
    this.stageChange(10, 1000, 1001);
    this.stageChange(30, 1001, 1002);
    this.stageChange(50, 1002, 1003);
    this.stageChange(100, 1003, 1004);
    this.stageChange(200, 1004, 1005);
    this.stageChange(300, 1005, 1006);

    sendEvent(12, { item: item, timestamp: Date.now(), currentStage: this.currentStage })
  }



  reset() {
    this.score = 0;
    this.currentStage = 1000;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);

    this.drawStage()
  }


  drawStage() {
    const stageY = 50 * this.scaleRatio;
    const fontSize = 30 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = 'black';

    const stageText = `Stage ${this.currentStage - 999}`; // 스테이지 번호 계산
    const stageX = this.canvas.width / 2 - this.ctx.measureText(stageText).width / 2;

    this.ctx.fillText(stageText, stageX, stageY);
  }
}

export default Score;

