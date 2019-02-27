<template>
  <div id="upload">
    <h1>Upload Image</h1>
    <h4>share your memories.</h4>
    <div style="margin-top: 4%" v-if="this.$root.$data.loading === true">
        <img class="upload-load" src="https://media.giphy.com/media/2A6xoqXc9qML9gzBUE/giphy.gif"/>
    </div>
    <form @submit.stop.prevent="handleSubmit" class="margin-sm">
      
      <div class="border-style">
        <b-form-file @change="captureFile" plain></b-form-file>
      </div>

      <b-form-textarea
          v-model="caption"
          placeholder="Post description"
          :rows="3"
          :max-rows="6"
          class="margin-xs"
        ></b-form-textarea>
      <b-button class="margin-xs" variant="secondary" @click="handleOk">Upload</b-button>

    </form>
  </div>
</template>

<script>
import ipfs from '../contracts/ipfs';

export default {
  name: "upload",
  //variables
  data() {
    return {
      buffer: "",
      caption: ""
    };
  },
  methods: {
    //Handles the submission event from the UI.
    handleOk(evt) {
      if (!this.buffer || !this.caption) {
        alert("Please fill in the information.");
      } else {
        this.onSubmit();
      }
    },
    //Handles the choosing of file and converts it to buffer.
    captureFile(file) {
      let reader = new FileReader()
      if(typeof file !== 'undefined'){
        reader.readAsArrayBuffer(file.target.files[0])
        reader.onloadend = async () => this.buffer = await this.convertToBuffer(reader.result)
      }
      else this.buffer = '';
    },
    //File to buffer converter
    async convertToBuffer(reader) {
      return await Buffer.from(reader);
    },
    //Sends file to IPFS and the hashes retrieved are sent to our contract.
    //Calls the NewPost event when transaction finishes.
    async onSubmit() {

      if(this.buffer !== '' && this.caption !== ''){
        let bufferDesc = await this.convertToBuffer(this.caption)
        this.$root.loading = true
        var imgHash = ""
        var textHash = ""

        await ipfs.add(this.buffer, async (err, ipfsHash) => {
          imgHash = ipfsHash[0].hash

          await ipfs.add(bufferDesc, async (err, ipfsHash) => {
            textHash = ipfsHash[0].hash

            await this.$root.contract.methods.sendHash(imgHash, textHash).send({ from: this.$root.currentAccount }, 
            (error, transactionHash) => {
                if(typeof transactionHash !== 'undefined'){
                  this.$root.contract.once('NewPost', {from: this.$root.currentAccount}, 
                  (err, evt)=>{
                      this.$root.loading = false
                      alert("Transaction Finished!");
                      this.$root.onNewPost();
                  })
                }
                else this.$root.loading = false
            }); 
          })
        })
      }
    }
  }
};
</script>

<style>
#upload {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10%;
}

.upload-load {
  width: 50px; 
  height: 50px;
}

.margin-xs {
  margin-top: 3%;
}

.margin-sm {
  margin-top: 7%;
}

.border-style {
  border: 1px solid #ced4da;
}
</style>