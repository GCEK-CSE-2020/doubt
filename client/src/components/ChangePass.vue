<template>
  <aside>
    <img src="/assets/back.svg" @click="setChange" alt="Go Back" />
    <label>Old Password:</label>
    <input
      v-model="pass"
      type="password"
      placeholder="Type Your Password Here"
      title="Type Your Password Here"
    />
    <label>New Password:</label>
    <input
      v-model="newPass"
      type="password"
      placeholder="Type Your New Password Here"
      title="Type Your New Password Here"
    />
    <input type="button" @click="change" value="Change Password" />
  </aside>
</template>

<script>
export default {
  name: "changePass",

  props: {
    socket: Object,
    setChange: Function,
    email: String,
  },

  data() {
    return {
      pass: "",
      newPass: "",
    };
  },

  created() {
    this.socket.on("change", (json) => {
      if (json.status == "true") {
        const log = JSON.parse(localStorage.getItem("log"));
        log.api = json.newPass;
        localStorage.setItem("log", JSON.stringify(log));
        alert("Password Changed");
        this.setChange();
      } else {
        alert("Server Error");
      }
    });
  },

  methods: {
    change() {
      const conf = confirm("Are You Sure?");

      if (conf) {
        this.socket.emit("change", {
          email: this.email,
          pass: this.pass,
          newPass: this.newPass,
        });
      }
    },
  },
};
</script>

<style scoped>
aside {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding-top: 2em;
  z-index: 3;
  text-align: center;
  background: #000;
  overflow: auto;
}

aside > * {
  display: block;
}

input {
  width: calc(100vw - 2em);
  max-width: calc(450px - 2em);
  height: 2em;
  margin: 0.5em auto;
  background: #444;
  color: #fff;
  border: 1px solid #0075d2;
  border-radius: 0.25em;
  padding: 0.25em;
  box-shadow: 0.125em 0.125em 0.25em 0 rgba(0, 0, 0, 0.25);
}

input[type="button"] {
  background: #0075d2;
}

img {
  width: 1em;
  position: absolute;
  left: 1em;
  top: 1em;
  z-index: 4;
}

@media screen and (min-width: 450px) {
  img {
    position: absolute;
    left: calc(50vw - (225px - 1em));
    top: 1em;
  }
}
</style>
