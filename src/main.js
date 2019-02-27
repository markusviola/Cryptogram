import Vue from 'vue'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'babel-polyfill';
import App from './App.vue';
import Home from './components/Home.vue'
import Upload from './components/Upload.vue'
import Profile from './components/Profile.vue'
import web3 from './contracts/web3';
import VueLazyLoad from 'vue-lazyload';
import contract from './contracts/contractInstance';
import 
{ 
  Nav, Image, Card, Layout, Button, Modal, FormFile
} 
from 'bootstrap-vue/es/components'


Vue.use(BootstrapVue);
Vue.use(Nav);
Vue.use(Image);
Vue.use(Card);
Vue.use(FormFile);
Vue.use(Layout);
Vue.use(Button);
Vue.use(Modal);
Vue.use(VueLazyLoad);
Vue.use(VueRouter);


const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [{
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/upload',
      name: 'upload',
      component: Upload
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    }
  ]
})

new Vue({
  data: {
    currentPosts: [],
    currentAccount: '',
    currentAccountPosts: [],
    username: "Nameless User",
    loading: false,
    contract: contract
  },
  router,
  async created() {
    await this.updateAccount()
    await this.watchAccount()
    await this.getPosts()
  },
  transformToRequire: {
    'img': 'src',
    'image': 'xlink:href'
  },
  el: '#app',
  methods: {
    async updateAccount(){
      const accounts = await web3.eth.getAccounts();
      this.currentAccount = accounts[0];
      this.getDisplayName()
      this.getAccountPosts()
    },
    async getDisplayName(){
      await contract.methods.username(this.currentAccount).call(
      (err, res) => {
          if(res !== "") this.username = res
          else this.username = "Nameless User"
      });
    },
    getAccountPosts(){
      if(this.currentPosts.length !== 0){
        this.currentAccountPosts = this.currentPosts.filter((item) => {
          return item.owner === this.currentAccount ? true: false
        })
        for(let i=0; i<this.currentAccountPosts.length; i++)
          this.currentAccountPosts[i].id = i+1;
      }
    },
    watchAccount(){
      window.ethereum.on('accountsChanged', (accounts) => {
        this.updateAccount()
      })
    },
    async getPosts() {
      this.loading = true;
      let posts = [];
      let counter = await contract.methods.getCounter().call({
        from: this.currentAccount
      });

      if (counter !== null) {
        for (let i = counter; i >= 1; i--) {
          let post = await contract.methods.getHash(i).call({
            from: this.currentAccount
          });
          let text = await fetch("https://gateway.ipfs.io/ipfs/" + post.text)
                          .then((res) => res.text());
          let name = await contract.methods.username(post.owner).call({
            from: this.currentAccount
          });

          posts.push({
            id: parseInt(i),
            key: "key"+i,
            owner: post.owner,
            caption: text,
            src: "https://gateway.ipfs.io/ipfs/" + post.img,
            username: name === "" ? "Nameless User" : name
          });

        }
        this.currentPosts = posts;
        this.getAccountPosts();
        this.loading = false;
      }
    },
    onNewPost(){
      this.getPosts();
    },
    onNameSet(){
      this.getDisplayName();
    }
  },
  render: h => h(App)
})