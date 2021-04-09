<template>
  <Filter
    :socket="socket"
    :setData="setData"
    :logout="logout"
    :email="email"
    :api="api"
  />

  <Content :socket="socket" :data="data" :email="email" :api="api" />
</template>

<script>
import Filter from "./Filter";
import Content from "./Content";

export default {
  name: "Questions",

  props: {
    socket: Object,
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
