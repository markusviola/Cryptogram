<template>
  <div id="profile">
    <b-container fluid>
      <b-row>

        <b-col class="profile-remove-padding">
          <b-img
            rounded="circle"
            width="180"
            height="180"
            src="https://image.flaticon.com/icons/svg/149/149452.svg"
            fluid
          />
        </b-col>

        <b-col class="profile-info">
          <b-container fluid>
            <b-row>
              <b-col>
                <h3>
                  {{ this.$root.$data.username }}
                  <b-button style="margin-left: 10px" size="lg" variant="link" v-b-modal.modalPrevent>
                    <img
                      width="40"
                      height="40"
                      src="https://image.flaticon.com/icons/svg/118/118779.svg"
                    >
                  </b-button>
                </h3>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <h5>{{ this.$root.$data.currentAccountPosts.length }} posts</h5>
              </b-col>
            </b-row>
          </b-container>
        </b-col>

      </b-row>
    </b-container>

    <b-container fluid class="profile-grid">

      <b-row v-if="this.$root.$data.currentAccountPosts.length == 0">
        <b-col>
          <h2 class="profile-h2">No Post</h2>
        </b-col>
      </b-row>

      <b-row v-for="i in Math.ceil(this.$root.$data.currentAccountPosts.length / 3)" v-bind:key="i">
        <b-col
          v-for="item in $root.$data.currentAccountPosts.slice((i - 1) * 3, i * 3)"
          v-bind:item="item"
          v-bind:key="item.id"
        >
          <b-img thumbnail fluid :src="item.src" class="profile-img-grid" @click="openGallery(item.id -1)"/>
        </b-col>
      </b-row>

      <div v-if="this.$root.$data.loading === true">
        <img class="profile-load" src="https://media.giphy.com/media/2A6xoqXc9qML9gzBUE/giphy.gif"/>
      </div>
      
    </b-container>

    <b-modal
      id="modalPrevent"
      ref="modal"
      title="Submit your name"
      @ok="handleOk"
      @shown="clearName"
    >
      <form @submit.stop.prevent="handleSubmit">
        <b-form-input type="text" placeholder="Enter your name" v-model="nameFieldText"></b-form-input>
      </form>
    </b-modal>
    
    <!-- This Lightbox component is optional, you can remove it -->

    <LightBox 
      :images="$root.$data.currentAccountPosts" 
      ref="lightbox"
      :show-caption="true"
      :show-light-box="false"
      :show-thumbs="false">
    </LightBox>

  </div>
</template>

<script>
import LightBox from 'vue-image-lightbox'
require('vue-image-lightbox/dist/vue-image-lightbox.min.css')

export default {
  name: "profile",
  components: {
    LightBox,
  },
  //variables
  data() {
    return {
      postCount: 0,
      nameFieldText: "",
      items: []
    };
  },
  methods: {
    //clears name upon edit submit
    clearName() {
      this.nameFieldText = "";
    },
    //Handles the name submission from the UI.
    handleOk(evt) {
      evt.preventDefault();
      if (!this.nameFieldText) {
        alert("Please enter your name");
      } else {
        this.handleSubmit();
      }
    },
    //Calls the setName function from the contract.
    //Calls the SetName event when transaction finishes.
    async handleSubmit() {
      await this.$root.contract.methods.setName(this.nameFieldText).send(
        {
          from: this.$root.currentAccount
        }, 
        (error, transactionHash) => {
          this.$refs.modal.hide();
          alert("Your name will be updated momentarily...");

          this.$root.contract.once('SetName', {from: this.$root.currentAccount}, 
          (err, evt)=>{
              alert("Transaction Finished!");
              this.$root.onNameSet();
              for(let i=0; i<this.$root.currentAccountPosts.length; i++){
                this.$root.currentAccountPosts[i].username = this.nameFieldText;
              }
              this.clearName()
          })
        }
      )
    },
    //For our Lightbox image display
    openGallery(index) {
      this.$refs.lightbox.showImage(index)
    }
  }
};
</script>

<style>
#profile {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10%;
}

.profile-remove-padding {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding-right: 30px;
}

.profile-img-grid {
  margin-top: 5%;
}

.profile-grid {
  margin: 10% 0;
}

.profile-info {
  margin-top: 10%;
  text-align: left;
}

.profile-load {
  margin-top: 30px;
  width: 50px; 
  height: 50px;
}

.profile-h2 {
  font-weight: normal;
}

.vue-lb-info {
  height: 50px;
}
</style>