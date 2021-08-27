import Vue from 'vue';
import Router from 'vue-router';
import index from '@/views/index';
import room from '@/views/room';
import game from '../components/Game.vue';
import poker from '../components/Poker.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
    },
    {
      path: '/room/:id',
      name: 'Room',
      component: room,
    },
    {
      path: '/game',
      name: 'Game',
      component: game,
    },
    {
      path: '/poker',
      name: 'Poker',
      component: poker,
    },
  ],
});
