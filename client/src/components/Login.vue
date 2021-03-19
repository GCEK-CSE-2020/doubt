<template>
  <div class="login">
    <div>
      <label>Email:</label>
      <input
        v-model="email"
        type="text"
        placeholder="Type Your Email Here"
        title="Type Your Email Here"
      />
      <label>Password:</label>
      <input
        v-model="pass"
        type="password"
        placeholder="Type Your Password Here"
        title="Type Your Password Here"
      />
      <input type="button" value="Get In" @click="getIn" />
    </div>
  </div>
</template>

<script>
import fetchData from "../scripts/fetchData";

export default {
  name: "Login",

  props: {
    setEmail: Function,
    setApi: Function,
    login: Function,
    startProgress: Function,
    endProgress: Function,
  },

  data() {
    return {
      email: "",
      pass: "",
    };
  },

  methods: {
    getIn() {
      const email = this.email.toLowerCase().trim();

      if (email && this.pass) {
        this.startProgress();

        fetchData(
          "check",
          {
            email: email,
            pass: this.pass,
          },
          this.func
        );
      } else {
        alert("Fill All Fields");
      }
    },

    func(json) {
      const email = this.email.trim().toLowerCase();

      this.endProgress();

      if (json.status == "true") {
        this.setEmail(email);
        this.setApi(json.api);
        localStorage.setItem(
          "log",
          JSON.stringify({
            expire: new Date().getTime(),
            email: email,
            api: json.api,
          })
        );
        this.login();
      } else {
        alert("Email Or Pass Is Wrong");
      }
    },
  },
};
</script>

<style scoped>
input,
label {
  display: block;
}

input {
  width: 20em;
  height: 2em;
  margin: 0.5em;
  background: #444;
  color: #fff;
  border: 1px solid #0075d2;
  border-radius: 0.125em;
  padding: 0.25em;
  box-shadow: 0.125em 0.125em 0.25em 0 rgba(0, 0, 0, 0.25);
}

input[type="button"] {
  background: #0075d2;
}

.login {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: grid;
  place-items: center;
  margin-top: -8em;
}

.login div {
  display: grid;
  text-align: center;
}
</style>
