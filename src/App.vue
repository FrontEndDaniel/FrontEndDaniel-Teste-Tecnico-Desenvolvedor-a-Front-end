<template>
  <div id="fundo">
    <router-view />
  </div>
</template>

<script lang="ts">
export default {
  name: 'App',
};
</script>

<style>
#fundo {
  background-image: url("https://i.pinimg.com/originals/ca/e0/1a/cae01ab5cce960db0d7819cc96e97ce8.png");
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
