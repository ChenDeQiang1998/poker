<template>
  <div class="layout">
    <div class="center-flex">
      <span class="pointer" @click="createRoom"><router-link to="/game">创建房间</router-link></span>
      <textarea>4PL够级规则：
      1、游戏人数6人，5副牌，每副牌中除去基本牌54张，还有一张花王，又叫暗王，价值与大王等同。总牌再去除14张3,3张4，共258张牌，6名玩家每人起始43张手牌。
      2、游戏结束方式，玩家轮流出牌，直到第5名玩家出完牌或者被关
      3、游戏占位：游戏中，6名玩家分为2对，成三角对坐，你的上家、下家及对家（你的下3位/上3位）是另一队的玩家。你的上2家和下2家，是你的队友，玩家以牌桌围成6边型。
      4、第一局游戏规则：每名玩家轮流摸牌，其中随机一张牌为起始玩家牌，摸到的玩家定为第一位出牌的玩家，直到摸完为止。
          而后所有玩家出示手中的3牌，没有3牌的玩家必须向其他玩家‘购买’，价格为你最大的一张牌（不包含花王）。
          交牌次序：大王》小王》2。
          买3牌对象优先级：对家》队友》其他玩家。
          当每名玩家都拥有且只有1张3时，游戏开始。
      5、出牌规则：当确定一名玩家优先开始后，以顺时针方向进行游戏。
          每名玩家禁止向其他玩家透露手中剩余扑克数量。
          玩家禁止在有其他牌的情况下出3。
          玩家只能出单一种类的牌若干张，如手中有6张4/7，只允许出1-6张数量的4/7。
          王与2除外，王与2可以当癞子牌加入任意牌中打出。其他人想要跟牌，必须出等量的更高点数的牌。
              如：4个4只能用4个5或者4个6以上的牌打出，5个5与5个6都不行。
          挂王打出，挂王的牌，必须也挂王才能打过，且必须按每一张王都要压过对方。
              王规则：
                  一张小王《两张小王/大王
                  两张小王《4张小王/2张大王
                  1张大王《两张大王/3张小王
                  1张小王2张大王《5张大王/2张小王4张大王/3张小王1张大王2张大王
      6、特殊规则：头客、点、烧、憋、落（lá）客
          够级牌：当玩家打出5张10、4张J、3张Q、2张K、2张A，则视为够级牌（挂2也算够级牌，但无法开点）。够级牌只能由对家反打，谁成功，则视为开点成功，如果挂2打出或反打，无法开点。
          头客：第一位出完牌，将3打出的玩家被称为头客，头客吃大落客2张贡牌。
          二客：第二位出完牌，将3打出的玩家被称为二客，二客吃二落客1张贡牌。
          点：开点成功的玩家可以吃未开点的对家1张贡牌，都开点成功，则互换贡牌。
          烧：使用够级牌攻打对家仍在的其他玩家称为烧，烧牌成功，则之后出牌每轮必须挂王。王不够挂时禁止烧牌，否则为大落。烧成功后，被烧玩家需交一张贡牌给烧成玩家。
          反烧：在被烧时反烧回去，贡点翻倍，反反烧同理，贡点倍数翻翻。
          憋：在玩家打出最后一手牌时，被其他人压一头，被称为憋，玩家此时手中只要一张3，无任何作为，以大落客的身份退出游戏，压住大落这手牌的玩家，吃大落一个贡。
          落客：最后一位持有牌的玩家被称为落客，落客需要向头客交2张贡牌。
          二落：倒数第二为持有牌的玩家被称为二落，二落需要向二客交1张贡牌。
          贡牌：贡牌为自己最大的一张牌（不包含花王）贡牌次序：大王》小王》2，小余2则清贡不交。贡牌无法重复使用。
              如，落客玩家1吃了一个点贡，获得一张大王，手中没有其他的大王小王与2了，得到的贡牌大王不能再次成为贡牌，玩家1清贡不交。
      7、次一轮游戏开始规则：每名玩家先买3卖3，而后以点、烧、憋、落的顺序依次交贡，游戏开始。
      8、计分规则：一般定为打满20分为一轮，可以自拟，收1贡，计+1分，交一贡，计-1分，买3不计分。
      </textarea>
    </div>
    <div class="center-flex">
      <div>
        <div style="margin-bottom: 30px">
          <input type="text" placeholder="请输入房间号" v-model="roomId">
        </div>
        <div>
          <span class="pointer" @click="joinRoom">加入房间</span>
        </div>
      </div>
    </div>
  <!-- <vue-canvas-nest></vue-canvas-nest>//鼠标磁吸 -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import vueCanvasNest from 'vue-canvas-nest';
// import _ from 'lodash';

export default {
  name: 'index',
  components: { vueCanvasNest },
  sockets: {

  },
  created() {
    console.log(this.userId);
  },
  computed: {
    ...mapGetters(['userId']),
  },
  data() {
    return {
      roomId: '',
    };
  },
  methods: {
    createRoom() {
      this.$socket.emit('createRoom', this.userId, (data) => {
        this.roomId = data;
        this.joinRoom();
      });
    },
    joinRoom() {
      this.$socket.emit('joinRoom', {
        playerId: this.userId,
        roomId: this.roomId,
      }, (data) => {
        if (data.code === '0') {
          this.$router.push({ name: 'Room', params: { id: data.id } });
        } else {
          alert('创建房间失败');
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.pointer {
  cursor: pointer;
}
.layout {
  height: 100vh;
  display: flex;
  .center-flex {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    textarea{
      position: relative;
      left: 50px;
      max-width: 1200px;
      min-width: 1200px;
      max-height: 555px;
      min-height: 555px;
    }
  }
}
</style>
