<template>
  <div class="layout" @mouseenter="clickup()" @mouseup="clickup()">
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
    玩家{{Player + 1}}
    <button class="btnPl" @click="dealpoker(-999)">出牌</button>
    <button class="btnPl" @click="uppoker()">取消</button>
    <button class="btnPl" @click="dont()">不要</button>
    <div class="poker-box">
      <div class="poker-item" :style=item.type v-for="(item,index) in pokerList[Player]" :key="index"
      @dblclick="dealpoker(index)"
      @mousedown="clickdown(index)"
      @mouseup="clickup(index)"
      @mouseenter="mouseenter(index)">
        <poker :style=item.bcolor :name="item.name" :type="item.suit"></poker>
      </div>
    </div>
    <!-- 玩家2
    <div class="poker-box">
      <div class="poker-item" :style=item.type v-for="(item,index) in pokerList[Player]" :key="index"
      @dblclick="dealpoker(index)"
      @mousedown="clickdown(index)"
      @mouseup="clickup(index)"
      @mouseenter="mouseenter(index)">
        <poker :style=item.bcolor :name="item.name" :type="item.suit"></poker>
      </div>
    </div>
    玩家3
    <div class="poker-box">
      <div class="poker-item" :style=item.type v-for="(item,index) in pokerList[Player]" :key="index"
      @dblclick="dealpoker(index)"
      @mousedown="clickdown(index)"
      @mouseup="clickup(index)"
      @mouseenter="mouseenter(index)">
        <poker :style=item.bcolor :name="item.name" :type="item.suit"></poker>
      </div>
    </div>
    玩家4
    <div class="poker-box">
      <div class="poker-item" :style=item.type v-for="(item,index) in pokerList[Player]" :key="index"
      @dblclick="dealpoker(index)"
      @mousedown="clickdown(index)"
      @mouseup="clickup(index)"
      @mouseenter="mouseenter(index)">
        <poker :style=item.bcolor :name="item.name" :type="item.suit"></poker>
      </div>
    </div>
    玩家5
    <div class="poker-box">
      <div class="poker-item" :style=item.type v-for="(item,index) in pokerList[Player]" :key="index"
      @dblclick="dealpoker(index)"
      @mousedown="clickdown(index)"
      @mouseup="clickup(index)"
      @mouseenter="mouseenter(index)">
        <poker :style=item.bcolor :name="item.name" :type="item.suit"></poker>
      </div>
    </div>
    玩家6
    <div class="poker-box">
      <div class="poker-item" :style=item.type v-for="(item,index) in pokerList[Player]" :key="index"
      @dblclick="dealpoker(index)"
      @mousedown="clickdown(index)"
      @mouseup="clickup(index)"
      @mouseenter="mouseenter(index)">
        <poker :style=item.bcolor :name="item.name" :type="item.suit"></poker>
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
      Player:0,//当前玩家
      count:0,
    };
  },
  methods: {
    //清空桌面,重新取得一副牌并发牌
    init() {
      this.Player = 0;//重置初始玩家为0
      this.pokerLost = [];//重置出牌库为空
      this.playerCount = this.playerCount >= 2 && this.playerCount <= 6 ? this.playerCount : 6//判断输入的玩家人数，不能高于6或低于2
      this.pokerCount = this.pokerCount >= 1 && this.pokerCount <= 5 ? this.pokerCount : 5//判断输入扑克数，不能高于5或低于1
      const newGame = new Game(this.playerCount, this.pokerCount);//取得一副新牌
      let pokerList = newGame.init();//分牌
      for(let i in pokerList){//为牌排序
        pokerList[i] = _.sortBy(pokerList[i], ['point']);
        pokerList[i].reverse();
      }
      this.pokerList = pokerList;//打印到界面
    },
    //出牌按钮
    dealpoker(k){
      let Hand = this.pokerList[this.Player].length -1//当前剩余手牌
      if(k !== -999){//鼠标双击
        let tsBrand = this.pokerList[this.Player][k].point
        //当手里有其他牌时，无法出3
        if(Hand === 0){//当只剩最后一张牌时（通常为3）直接打出它
          this.pokerLost = []//清空桌面
          this.pokerLost.push(this.pokerList[this.Player].splice(k, 1)[0])//打出牌并在手牌中删除它
        }else if(tsBrand !== 3){//当牌盒没空，且双击的这张牌不是3时
          if(this.pokerReasonable(k)){
            alert('您出的牌不符合规则');
            this.uppoker();
            return;}//判断能否出牌，不能则直接退出
          this.pokerLost = []//清空桌面
          this.pokerLost.push(this.pokerList[this.Player].splice(k, 1)[0])//打被双击的牌并在手牌中删除它
          for(let i in this.pokerList[this.Player]){
            if(this.pokerList[this.Player][i].type === 'margin: -5px -20px 15px;'){
              this.pokerLost.push(this.pokerList[this.Player].splice(i, 1,'')[0])//打出牌并在手牌中删除它
            }
          }
        }else{
          return;
        }
      }else {//单击出牌button按钮
        if(Hand === 0){//当只剩最后一张牌时（通常为3）直接打出它
          this.pokerLost = []//清空桌面
          this.pokerLost.push(this.pokerList[this.Player].splice(0, 1)[0])//打出牌并在手牌中删除它
          return;
        }
        if(this.pokerReasonable(k)){
          alert('您出的牌不符合规则');
          this.uppoker();
          return;}//判断能否出牌，不能则直接退出
        this.pokerLost = []//清空桌面
        for(let i in this.pokerList[this.Player]){
          if(this.pokerList[this.Player][i].type === 'margin: -5px -20px 15px;'){
              this.pokerLost.push(this.pokerList[this.Player].splice(i, 1,'')[0])//打出牌并在手牌中删除它
          }
        }
      }
      this.pokerList[this.Player] = this.pokerList[this.Player].filter(e => e)
      this.count = 0//重置空过轮次
      if (this.Player < this.playerCount -1) {
        this.Player++
      }else{
        this.Player = 0
      }
    },
    //取消按钮
    uppoker(){
      for(let i in this.pokerList[this.Player]){
        this.pokerList[this.Player][i].type = 'margin: 5px -20px;';
        this.pokerList[this.Player][i].bcolor = 'background: #FFF;';
      };
    },
    //不要按钮
    dont(){
      if (this.pokerLost.length !== 0) {//如果牌盒中有牌
        this.count++//空过轮次加1
        if (this.Player < this.playerCount -1) {//换人
          this.Player++
        }else{
          this.Player = 0
        }
        if (this.count === 5) {//如果已经空过5轮，清空牌盒，该玩家出牌
          this.count = 0
          this.pokerLost = []
        }
      }
      this.uppoker()
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
      let bcolor = this.pokerList[this.Player][k].bcolor;
      this.pokerList[this.Player][k].bcolor = /(background: #FFF;)/.test(bcolor) ?
                                  bcolor.replace(new RegExp(bcolorNo,''),bcolorYes) :
                                  bcolor.replace(new RegExp(bcolorYes,''),bcolorNo);
    },
    //更改扑克选中状态
    clickmove(k){
      let styledown = 'margin: 5px -20px;';
      let styleup = 'margin: -5px -20px 15px;';
      let pktype = this.pokerList[this.Player][k].type;
      this.pokerList[this.Player][k].type = /(margin: 5px -20px;)/.test(pktype) ?
                                  pktype.replace(new RegExp(styledown,''),styleup) :
                                  pktype.replace(new RegExp(styleup,''),styledown);
    },
    //判断出牌是否合理
    pokerReasonable(n){
      let NewpokerLost = [];//取得一个空的牌盒
      let k = n === -999 ? n : this.pokerList[this.Player][n].point
      if (this.pokerLost.length === 0) {//如果出牌牌库为空
        for(let i in this.pokerList[this.Player]){//将所有被选中的扑克装入空牌盒
          if(this.pokerList[this.Player][i].type === 'margin: -5px -20px 15px;'){
            NewpokerLost.push(this.pokerList[this.Player][i])
          }
        }
        if (k === -999 && NewpokerLost.length === 0) {return true;}//未选中牌时，按钮无效
        let pokerlost = k >= 15 ? -999 : k//设定一个初始基本牌（大于3，小余15）
        for(let i in NewpokerLost){//遍历被选中的牌
          let p = NewpokerLost[i].point//取得当前扑克的号码
          if(p < 15 && pokerlost === -999 && p !== 3){//赋予初始基本牌号码
            pokerlost = p
          }else if(p < 15 && p !== pokerlost || p === 3){//如果出现了不同的基本牌号码或者基本牌号码是3，则退出
            return true;
          }
        }
        return false;
      }else{
        //规则1：必须比对方大
        for(let i in this.pokerList[this.Player]){//将所有被选中的扑克装入空牌盒
          if(this.pokerList[this.Player][i].type === 'margin: -5px -20px 15px;'){
            NewpokerLost.push(this.pokerList[this.Player][i].point)//取得号码
          }
        }
        if (n !== -999) {
          if(this.pokerList[this.Player][n].type === 'margin: 5px -20px;'){
            NewpokerLost.push(this.pokerList[this.Player][n].point)//取得因重复点击而失去点击状态的当前牌
          }
        }
        let p = Math.min(...NewpokerLost)//取得最小扑克的号码
        let len = 0,ren = 0//当前选中牌与上一轮牌的大小王数量
        for(let i in NewpokerLost){//遍历被选中的牌
          let k = NewpokerLost[i]
          if(p === 3 || k === 3){
            return true
          }else if(p <= 15 && k === 15){//把2当钱//伪算法，实际上是不够则以此牌代替原牌，包含王也可代替，此处均未实现
            NewpokerLost[i] = p
          }else if(k > 15){//出现大小王
            len++
          }else if(p !== k){//出现两种基本牌
            return true;
          }
        }
        for(let i in this.pokerLost){
          if (this.pokerLost[i].point > 15) {
            ren++
          }
        }
        if(NewpokerLost.length - len === this.pokerLost.length - ren){//选中牌小余上轮出牌时，按钮无效//大小王判定暂时未实现
          if (Math.min(...NewpokerLost) > Math.min(...this.pokerLost.map(x => x.point))) {
            return false;
          }else{
            return true;
          }
        }else{
          return true;
        }
      }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.layout {
  // display: flex;
  height: 100vh;
  width: 100%;
  flex-direction: column;
  div {
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
  }
  .btnPl{
    display:inline-block;
    width: 80px;
    margin: 20px;
  }
}
.desktop{
  display: flex;
  height: 20vh;
  flex-wrap: wrap;
  margin: 40px 40px;
  .poker-item {
    margin: 5px -20px;
  }
}
.poker-box {
  display: flex;
  height: 60vh;
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
