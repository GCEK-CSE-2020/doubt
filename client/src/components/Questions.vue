<template>
  <div class="questions">
    <Filter
      v-bind:setData="setData"
      v-bind:logout="logout"
      v-bind:email="email"
      v-bind:api="api"
    />

    <Content v-bind:data="data" v-bind:email="email" v-bind:api="api" />
  </div>
</template>

<script>
import Filter from "./Filter";
import Content from "./Content";

export default {
  name: "Questions",

  props: {
    logout: Function,
    email: String,
    api: String,
  },

  components: {
    Filter,
    Content,
  },

  data() {
    return {
      data: [],
    };
  },

  methods: {
    setData(data) {
      this.data = data;
    },
  },
};
</script>

<style scoped>
div {
  width: calc(100vw - 1em);
  min-height: calc(100vh - 1em);
  padding: 0.5em;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 0.5em;
}
</style>

<style>
section {
  width: calc(100vw - 2em);
  padding: 0.5em;
  background: #222;
  border: 1px solid #0075d2;
  border-radius: 0.125em;
  box-shadow: 0.125em 0.125em 0.25em 0 rgba(0, 0, 0, 0.25);
}
</style>
