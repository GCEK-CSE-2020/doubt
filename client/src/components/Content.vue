<template>
  <div class="content">
    <div
      class="block"
      v-for="(details, index) in data"
      :key="index"
      @click="
        () => {
          pop(index);
        }
      "
    >
      <label class="head">{{ details.question }}</label>
      <br />
      <span>{{ new Date(details.time).toString() }}</span>
      <div v-html="details.description"></div>
    </div>
    <img
      class="none"
      src="/assets/change-filter.svg"
      alt="Try Changing Filter"
      v-if="!data.length"
    />
  </div>
  <Solved
    :socket="socket"
    :setSolved="setSolved"
    :details="current"
    :email="email"
    :api="api"
    :fetchComments="fetchDetails"
    v-if="solved"
  />

  <Unsolved
    :socket="socket"
    :setUnsolved="setUnsolved"
    :details="current"
    :email="email"
    :api="api"
    :fetchComments="fetchDetails"
    v-if="unsolved"
  />
</template>

<script>
import Solved from "./Solved";
import Unsolved from "./Unsolved";

export default {
  name: "Content",

  props: {
    socket: Object,
    data: Array,
    email: String,
    api: String,
  },

  data() {
    return {
      current: {},
      currentIndex: null,
      solved: false,
      unsolved: false,
    };
  },

  components: {
    Solved,
    Unsolved,
  },

  created() {
    this.socket.on("get_details", (json) => {
      if (json.status == "false") {
        alert("server Error");
      } else {
        delete json.question;
        this.current = { ...this.data[this.currentIndex], ...json };
        if (this.data[this.currentIndex].status == "solved") {
          this.solved = true;
        } else {
          this.unsolved = true;
        }
      }
    });

    this.socket.on("get_one", (json) => {
      this.current = { ...json };
      if (json.status == "solved") {
        this.solved = true;
      } else {
        this.unsolved = true;
      }
    });
  },

  mounted() {
    const url = window.location.href.split("?");

    if (url.length == 2 && url[1].split("=").length == 2) {
      this.fetchDetails(encodeURIComponent(url[1].split("=")[1]));
    }
  },

  methods: {
    pop(index) {
      this.currentIndex = index;
      this.socket.emit("get_details", {
        question: this.data[index].question,
        email: this.email,
        pass: this.api,
      });
    },

    fetchDetails(question) {
      this.socket.emit("get_one", {
        question: question,
        email: this.email,
        pass: this.api,
      });
    },

    setSolved() {
      this.solved = false;
    },

    setUnsolved() {
      this.unsolved = false;
    },
  },
};
</script>

<style scoped>
.content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding-top: 2em;
  z-index: 1;
  text-align: center;
  background: #000;
  overflow: auto;
}

.block {
  cursor: pointer;
  margin: 1em auto;
  padding: 0.5em 1em;
  background: #222;
  width: calc(100vw - 2em);
  max-width: calc(700px - 2em);
  border: 1px solid #0075d2;
  border-radius: 0.25em;
  word-wrap: break-word;
  user-select: none;
}

.head {
  font-size: 1.2em;
  font-weight: bold;
  color: #0075d2;
}

span {
  font-size: 0.75em;
  color: #999;
}

.block div {
  text-align: left;
}

.none {
  width: 95%;
  max-width: 25em;
  margin: 1em auto;
}
</style>
