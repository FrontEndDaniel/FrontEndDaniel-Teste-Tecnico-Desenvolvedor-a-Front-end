
import { createRouter, createWebHistory } from 'vue-router';
import PokemonList from './components/Lista/PokemonList.vue';
import PokemonDetail from './components/Detalhes/PokemonDetail.vue';


const routes = [
  { path: '/', component: PokemonList },
  {
    path: '/:pokemon',
    name: 'infoPokemon',
    component: PokemonDetail,
    props: true,  
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
