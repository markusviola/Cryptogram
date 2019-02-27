<template>
  <keep-alive>
  <div id="home">
    
    <ul class="home-list">
      <li v-for="item in this.$root.$data.currentPosts" v-bind:item="item" v-bind:key="item.key">
        <b-card
          border-variant="secondary"
          :img-src="item.src"
          :header="item.username"
        >
          <h2 slot="header">{{ item.username }}</h2>
          <p class="home-card-text">{{ item.caption }}</p>
        </b-card>
      </li>
      <div v-if="this.$root.$data.loading === true">
        <img class="home-load" src="https://media.giphy.com/media/2A6xoqXc9qML9gzBUE/giphy.gif"/>
      </div>
    </ul>
  </div>
  </keep-alive>
</template>

<script>
    //We just declared the name "home" for router referencing.
    export default { name: "home" };
</script>

<style>
#home {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  justify-content: center;
  color: #2c3e50;
  margin-top: 10%;
}

.home-load {
  width: 50px; 
  height: 50px;
}

.card img {
  object-fit: cover;
  height: 500px;
  width: 500px;
}

.card {
  text-align: left;
  width: 500px;
  margin-bottom: 20px;
}


.home-list{
  padding-left: 0;
  list-style-type: none;
}

.home-card-text {
  text-align: justify;
  margin-top: 10px;
}

</style>