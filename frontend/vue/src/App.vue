<script setup lang="ts">
import { ref } from "vue";
    const form = ref ({
      name: "",
      email: "",
      document: "",
      password: "",
      accountId: "",
      message: ""
    });

    async function signup(){
        const input = form.value;
       const response = await fetch("http://localhost:3000/signup", {
        method: "post",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(input)
        });
        const output = await response.json();
        if (output.accountId){
          form.value.accountId = output.accountId;
          form.value.message = "sucess"
        }else{
          form.value.message = output.message;
        }
    }
</script>

<template>
  <div>
      <div>
          <input class="input-name" type="text" v-model="form.name" placeholder="Name"/>
      </div>
      <div>
          <input class="input-email" type="text" v-model="form.email" placeholder="Email"/>
      </div>
      <div>
          <input class="input-document" type="text" v-model="form.document" placeholder="Document"/>
      </div>
      <div>
          <input class="input-password" type="text" v-model="form.password" placeholder="Password"/>
      </div>
      <button class="button-signup" @click="signup()">Signup</button>
      <span class="span-account-id">{{ form.accountId }}</span>
      <span class="span-message">{{ form.message }}</span>
  </div>
</template>

<style scoped>
</style>