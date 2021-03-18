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
      <span>{{ details.time }}</span>
      <div v-html="details.description"></div>
    </div>
  </div>

  <Solved
    :setSolved="setSolved"
    :details="current"
    :email="email"
    :api="api"
    v-if="solved"
  />

  <Unsolved
    :setUnsolved="setUnsolved"
    :details="current"
    :email="email"
    :api="api"
    v-if="unsolved"
  />
</template>

<script>
import Solved from "./Solved";
import Unsolved from "./Unsolved";

export default {
  name: "Content",

  props: {
    data: Array,
    email: String,
    api: String,
  },

  data() {
    return {
      current: {},
      solved: false,
      unsolved: false,
    };
  },

  components: {
    Solved,
    Unsolved,
  },

  methods: {
    pop(index) {
      this.current = this.data[index];
      if (this.data[index].answer) {
        this.solved = true;
      } else {
        this.unsolved = true;
      }
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
  margin: 1em;
  padding: 0.5em 1em;
  background: #222;
  width: calc(100vw - 2em);
  border: 1px solid #0075d2;
  border-radius: 0.25em;
  word-wrap: break-word;
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
</style>
