<template>
  <div class="layout" @mouseup="clickup()">
    <div style="flex: 1">
    人数:<input type="text" v-model="playerCount">
    牌数:<input type="text" v-model="pokerCount">
    <button @click="init">重置</button>
    </div>
    <div class="desktop">
      <div class="poker-item" v-for="(item,index) in pokerLost" :key="index">
        <poker :name="item.name" :type="item.suit"></poker>
      </div>
    </div>
    玩家1
    <button @click="dealpoker(-999)">出牌</button><button @click="uppoker()">取消</button>
    <div class="poker-box">
      <div class="poker-item" :style=item.type v-for="(item,index) in pokerList[0]" :key="index"
      @dblclick="dealpoker(index)"
      @mousedown="clickdown(index)"
      @mouseup="clickup(index)"
      @mouseenter="mouseenter(index)">
        <poker :style=item.bcolor :name="item.name" :type="item.suit"></poker>
      </div>
    </div>
    <!-- 玩家2
    <div class="poker-box">
      <div class="poker-item" v-for="(item,index) in pokerList[1]" :key="index">
        <poker :name="item.name" :type="item.suit"></poker>
      </div>
    </div>
    玩家3
    <div class="poker-box">
      <div class="poker-item" v-for="(item,index) in pokerList[2]" :key="index">
        <poker :name="item.name" :type="item.suit"></poker>
      </div>
    </div>
    玩家4
    <div class="poker-box">
      <div class="poker-item" v-for="(item,index) in pokerList[3]" :key="index">
        <poker :name="item.name" :type="item.suit"></poker>
      </div>
    </div>
    玩家5
    <div class="poker-box">
      <div class="poker-item" v-for="(item,index) in pokerList[4]" :key="index">
        <poker :name="item.name" :type="item.suit"></poker>
      </div>
    </div>
    玩家6
    <div class="poker-box">
      <div class="poker-item" v-for="(item,index) in pokerList[5]" :key="index">
        <poker :name="item.name" :type="item.suit"></poker>
      </div>
    </div> -->
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import _ from 'lodash';
import Game from '../js/init';
import Poker from './Poker';

export default {
  name: 'Game',
  components: {
    Poker,
  },
  created() {
    this.init();
  },
  data() {
    return {
      playerCount: 6,//初始玩家人数
      pokerCount: 5,//初始扑克副数
      pokerList: [],//玩家手牌容器
      pokerLost: [],//玩家出牌容器
      Mouse : false,//鼠标移动事件启动状态
      key: -1,//代替值
    };
  },
  methods: {
    //清空桌面,重新取得一副牌并发牌
    init() {
      this.pokerLost = [];
      const newGame = new Game(this.playerCount, this.pokerCount);
      let pokerList = newGame.init();
      for(let i in pokerList){
        pokerList[i] = _.sortBy(pokerList[i], ['point']);
        pokerList[i].reverse();
      }
      this.pokerList = pokerList;
    },
    //出牌
    dealpoker(k){
      let Hand = this.pokerList[0].length -1
      if(k !== -999){//鼠标双击
        let tsBrand = this.pokerList[0][k].point
        //当手里有其他牌时，无法出3
        if(Hand === 0){//当只剩最后一张牌时（通常为3）直接打出它
          this.pokerLost = []//清空桌面
          this.pokerLost.push(this.pokerList[0].splice(k, 1)[0])//打出牌并在手牌中删除它
        }else if(tsBrand !== 3){//当牌盒没空，且双击的这张牌不是3时
          if(this.pokerReasonable(tsBrand)){return;}
          this.pokerLost = []//清空桌面
          this.pokerLost.push(this.pokerList[0].splice(k, 1)[0])//打被双击的牌并在手牌中删除它
          for(let i in this.pokerList[0]){
            if(this.pokerList[0][i].type === 'margin: -5px -20px 15px;'){
              this.pokerLost.push(this.pokerList[0].splice(i, 1,'')[0])//打出牌并在手牌中删除它
            }
          }
        }
      }else {//单击出牌button按钮
        if(Hand === 0){//当只剩最后一张牌时（通常为3）直接打出它
          this.pokerLost = []//清空桌面
          this.pokerLost.push(this.pokerList[0].splice(0, 1)[0])//打出牌并在手牌中删除它
          return;
        }
        if(this.pokerReasonable(k)){return;}
        this.pokerLost = []//清空桌面
        for(let i in this.pokerList[0]){
          if(this.pokerList[0][i].type === 'margin: -5px -20px 15px;'){
              this.pokerLost.push(this.pokerList[0].splice(i, 1,'')[0])//打出牌并在手牌中删除它
          }
        }
      }
      this.pokerList[0] = this.pokerList[0].filter(e => e)
    },
    //取消
    uppoker(){
      for(let i in this.pokerList[0]){
        this.pokerList[0][i].type = 'margin: 5px -20px;';
        this.pokerList[0][i].bcolor = 'background: #FFF;';
      };
    },
    //鼠标单击按下时触发事件
    clickdown(k){
      this.key = k;
      this.clickmove(k);
      this.Mouse = true;
      this.colormove(k);
    },
    //鼠标单击后松开触发事件
    clickup(k){
      this.Mouse = false;
    },
    //鼠标移动到扑克上触发事件
    mouseenter(k){
      if(this.Mouse){
        this.colormove(k);
        this.clickmove(k);
      }
    },
    //更改扑克选中颜色
    colormove(k){
      let bcolorNo = 'background: #FFF;';
      let bcolorYes = 'background: #5cc774';
      let bcolor = this.pokerList[0][k].bcolor;
      this.pokerList[0][k].bcolor = /(background: #FFF;)/.test(bcolor) ?
                                  bcolor.replace(new RegExp(bcolorNo,''),bcolorYes) :
                                  bcolor.replace(new RegExp(bcolorYes,''),bcolorNo);
    },
    //更改扑克选中状态
    clickmove(k){
      let styledown = 'margin: 5px -20px;';
      let styleup = 'margin: -5px -20px 15px;';
      let pktype = this.pokerList[0][k].type;
      this.pokerList[0][k].type = /(margin: 5px -20px;)/.test(pktype) ?
                                  pktype.replace(new RegExp(styledown,''),styleup) :
                                  pktype.replace(new RegExp(styleup,''),styledown);
    },
    //判断出牌是否合理
    pokerReasonable(k){
      this.pokerLost = [];//清空出牌库，取得一个空的牌盒
      for(let i in this.pokerList[0]){//将所有被选中的扑克装入空牌盒
        if(this.pokerList[0][i].type === 'margin: -5px -20px 15px;'){
          this.pokerLost.push(this.pokerList[0][i])
        }
      }
      let pokerlost = k > 15 ? -999 : k//设定一个初始基本牌（大于3，小余15）
      for(let i in this.pokerLost){//遍历被选中的牌
        let p = this.pokerLost[i].point//取得当前扑克的号码
        if(p < 15 && pokerlost === -999 && p !== 3){//赋予初始基本牌号码
          pokerlost = p
        }else if(p < 15 && p !== pokerlost || p === 3){//如果出现了不同的基本牌号码或者基本牌号码是3，则退出
          this.pokerLost = [];
          alert('您出的牌不符合规则');
          this.uppoker();
          return true;
        }
      }
      return false;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.layout {
  display: flex;
  height: 100vh;
  width: 100%;
  flex-direction: column;
  div {
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
  }
}
.desktop{
  display: flex;
  height: 50vh;
  flex-wrap: wrap;
  margin: 40px 40px;
  .poker-item {
    margin: 5px -20px;
  }
}
.poker-box {
  display: flex;
  height: 80vh;
  flex-wrap: wrap;
  margin: 0 40px;
  .poker-item {
    margin: 5px -20px;
    .pkcolor{
      background: #255;
    }
  }
  .uppoker{
    margin: -5px -20px 15px;
  }
}
</style>
