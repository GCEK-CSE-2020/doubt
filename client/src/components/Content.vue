<template>
  <section>
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
      {{ details.description }}
    </div>

    <Solved
      v-bind:setSolved="setSolved"
      v-bind:details="current"
      v-bind:email="email"
      v-bind:api="api"
      v-if="solved"
    />

    <Unsolved
      v-bind:setUnsolved="setUnsolved"
      v-bind:details="current"
      v-bind:email="email"
      v-bind:api="api"
      v-if="unsolved"
    />
  </section>
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
.block {
  cursor: pointer;
  margin: 0.5em;
  padding: 0.5em 1em;
  background: #444;
  width: calc(100vw - 5em);
  border: 1px solid #0075d2;
  border-radius: 0.125em;
  box-shadow: 0.125em 0.125em 0.25em 0 rgba(0, 0, 0, 0.25);
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

.block {
  word-wrap: break-word;
}
</style>
