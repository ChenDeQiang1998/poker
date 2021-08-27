class Poker {
  constructor(suit, point) {
    this.suit = suit;
    this.point = point;
    this.type = 'margin: 5px -20px;'
    this.bcolor = 'background: #FFF;'
    this.name = this.getPokerName();
  }
  getPokerName() {
    const point = this.point;
    switch (point) {
      case 18:
        return '花';
      case 17:
        return '大';
      case 16:
        return '小';
      case 15:
        return '2';
      case 14:
        return 'A';
      case 13:
        return 'K';
      case 12:
        return 'Q';
      case 11:
        return 'J';
      default:
        return point;
    }
  }
}

export default class Game {
  /**
   * @param {int} x 游戏人数
   * @param {int} y 使用几幅扑克
   */
  constructor(x, y) {
    x > 6 ? x = 6 : x;//游戏人数最多6人
    y > 5 ? y = 5 : y;//使用扑克最多5副
    this.playerCount = x;
    this.pokersCount = y;
  }
  init() {
    this.pokers = [];
    this.dealIdx = 0; // 分牌序列
    for (let i = 0; i < this.playerCount; i += 1) {
      this.pokers.push([]);
    }
    const allPokers = this.allPokers();
    this.deal(allPokers);
    console.log(this.pokers)
    console.log(this.pokers[0])
    return this.pokers;
  }
  // 分牌
  deal(allPokers) {
    const randomNum = Math.round(Math.random() * (allPokers.length - 1));
    this.pokers[this.dealIdx].push(allPokers[randomNum]);
    this.dealIdx = this.dealIdx === (this.playerCount - 1) ? 0 : this.dealIdx + 1;
    allPokers.splice(randomNum, 1);
    if (allPokers.length > 0) {
      this.deal(allPokers);
    }
  }
  // 获取全部牌
  allPokers() {
    const poker = [];
    for (let ps = 0; ps < this.pokersCount; ps += 1) {
      for (let i = 4; i <= 18; i += 1) {
        if(i === 4 && ps > 0){
          // 4号牌
          let k = 0;
          while (k < 4) {
            k += 1;
            poker.push(new Poker(k, i));
          }
        }else if (i <= 15 && i !== 4) {
          // 普通牌
          let k = 0;
          while (k < 4) {
            k += 1;
            poker.push(new Poker(k, i));
          }
        } else if(i !== 4){
          // 王牌
          poker.push(new Poker(5, i));
        }
      }
    }
    // 第17张4
    poker.push(new Poker(1, 4));
    let k = 0;
    while (k < 6) {
      k += 1;
      poker.push(new Poker(4, 3));
    }
    return poker;
  }
}
