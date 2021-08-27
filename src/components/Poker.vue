<template>
  <div class="card" :class="cardStyle">
    <span>{{name}}</span>
  </div>
</template>

<script>
export default {
  name: 'Poker',
  props: {
    // 枚举类型 1: ♣, 2: ♦, 3: ♥, 4: ♠
    type: {
      type: Number,
    },
    name: {
      type: [String, Number],
    },
    size: {
      type: String,
      default: 'normal',
    },
  },
  computed: {
    cardStyle() {
      switch (this.type) {
        case 1:
          return 'suitdiamonds';
        case 2:
          return 'suitclubs';
        case 3:
          return 'suitspades';
        case 4:
          return 'suithearts';
        case 5:
          return 'suitJoker';
        default:
          return '';
      }
    },
  },
};
</script>

<style scoped lang="less">
.card {
  position: relative;
  margin-right: 10px;
  width: 120px;
  height: 100%;
  border-radius: 10px;
  background: #FFF;
  box-shadow: 3px 3px 7px rgba(0,0,0,0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  min-width: 100px;
  min-height: 150px;
  span {
    margin: 0;
    font-family: Georgia, Times New Roman, serif;
    overflow: hidden;
    font-size: 50px;
  }
}
.suitdiamonds:before, .suitdiamonds:after {
  content: "♦";
  color: #ff0000;
}

.suithearts:before, .suithearts:after {
  content: "♥";
  color: #ff0000;
}

.suitclubs:before, .suitclubs:after {
  content: "♣";
  color: #000;
}

.suitspades:before, .suitspades:after {
  content: "♠";
  color: #000;
}
.suitJoker:before, .suitJoker:after {
  content: "joker";
  color: rgb(0, 0, 0);
}
div[class*='suit']:before {
  position: absolute;
  font-size: 25px;
  left: 8px;
  top: 8px;
}

div[class*='suit']:after {
  position: absolute;
  font-size: 25px;
  right: 8px;
  bottom: 8px;
}
</style>
