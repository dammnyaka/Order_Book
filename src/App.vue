<template>
   <div>
      <StockComponent />
   </div>
</template>

<script>
import StockComponent from "./components/StockComponent.vue";

export default {
   name: "App",
   components: {
      StockComponent,
   },
};
</script>

<style>
html {
   background-color: rgb(20, 20, 20);
}
#app {
   font-family: Avenir, Helvetica, Arial, sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   text-align: center;
   color: #2c3e50;
   margin-top: 60px;
}
</style>
