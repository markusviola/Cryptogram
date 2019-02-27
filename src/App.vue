<template>
  <div id="app">
    <b-nav justified>
      <b-nav-item active>
        <router-link :to="{ name: 'home' }">
          <img width="25" height="25" src="https://image.flaticon.com/icons/svg/263/263115.svg">
        </router-link>
      </b-nav-item>
      <b-nav-item>
        <router-link :to="{ name: 'upload' }">
          <img width="25" height="25" src="https://image.flaticon.com/icons/svg/149/149156.svg">
        </router-link>
      </b-nav-item>
      <b-nav-item>
        <router-link :to="{ name: 'profile' , params: { id: 123 }}">
          <img width="25" height="25" src="https://image.flaticon.com/icons/svg/1077/1077063.svg">
        </router-link>
      </b-nav-item>
    </b-nav>
    <div class="feed-container">
      <router-view class="view"></router-view>
    </div>
  </div>
</template>

<!-- Optional CSS Styling -->
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}

.feed-container {
  margin: 20px 20%;
  border-block-start: #2c3e50;
}
</style>
