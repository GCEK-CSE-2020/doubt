<template>
  <Questions :email="email" :api="api" :logout="logout" v-if="log" />

  <Login :setEmail="setEmail" :setApi="setApi" :login="login" v-else />
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

  created() {
    if (!navigator.onLine) {
      alert("This Application Want Internet To Work");
      window.close();
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
      const conf = confirm("Are You Sure?");

      if (conf) {
        localStorage.removeItem("log");
        this.log = false;
      }
    },
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #000;
  color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  user-select: none;
}

input[type="button"],
select {
  cursor: pointer;
}
</style>
