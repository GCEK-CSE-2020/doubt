<template>
  <aside>
    <div>
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
      <input type="button" @click="setChange" value="Cancel" />
    </div>
  </aside>
</template>

<script>
import fetchData from "../scripts/fetchData";

export default {
  name: "changePass",

  props: {
    setChange: Function,
    email: String,
  },

  data() {
    return {
      pass: "",
      newPass: "",
    };
  },

  methods: {
    change() {
      fetchData(
        "change",
        {
          email: this.email,
          pass: this.pass,
          newPass: this.newPass,
        },
        (json) => {
          if (json.status == "true") {
            let log = JSON.parse(localStorage.getItem("log"));
            log.api = json.newPass;
            localStorage.setItem("log", JSON.stringify(log));
            this.setChange();
            alert("Password Changed");
          } else {
            alert("Server Error");
          }
        }
      );
    },
  },
};
</script>

<style scoped>
aside {
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  min-height: 100vh;
  right: 0;
  display: grid;
  place-items: center;
}

div {
  display: grid;
  text-align: center;
  background: #000;
  border: 1px solid #0075d2;
  border-radius: 0.125em;
  padding: 0.5em;
  box-shadow: 0.125em 0.125em 0.25em 0 rgba(0, 0, 0, 0.25);
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
  width: 20.5em;
  height: 2.5em;
  background: #0075d2;
}

input[type="text"] {
  height: 1.5em;
}
</style>
