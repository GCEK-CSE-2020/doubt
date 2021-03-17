<template>
  <Questions
    v-bind:email="email"
    v-bind:api="api"
    v-bind:logout="logout"
    v-if="log"
  />

  <Login
    v-bind:setEmail="setEmail"
    v-bind:setApi="setApi"
    v-bind:login="login"
    v-else
  />
</template>

<script>
import Questions from "./components/Questions.vue";
import Login from "./components/Login.vue";

export default {
  name: "App",

  components: {
    Login,
    Questions,
  },

  data() {
    return {
      log: false,
      email: "",
      api: "",
    };
  },

  onCreated() {
    if (!navigator.onLine) {
      alert("This Application Want Internet To Work");
    }

    const log = localStorage.getItem("log");

    if (log) {
      if (Number(JSON.parse(log).expire) + 604800000 > new Date().getTime()) {
        this.email = JSON.parse(log).email;
        this.api = JSON.parse(log).api;
        this.log = true;
      } else {
        localStorage.removeItem("log");
      }
    }
  },

  methods: {
    setEmail(email) {
      this.email = email;
    },

    setApi(api) {
      this.api = api;
    },

    login() {
      this.log = true;
    },

    logout() {
      localStorage.removeItem("log");
      this.log = false;
    },
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #000;
  color: #fff;
  width: 100vw;
  min-height: 100vh;
  box-sizing: border-box;
  user-select: none;
}

input[type="button"],
select {
  cursor: pointer;
}
</style>
