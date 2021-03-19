<template>
  <Filter
    :setData="setData"
    :logout="logout"
    :email="email"
    :api="api"
    :startProgress="startProgress"
    :endProgress="endProgress"
  />

  <Content
    :data="data"
    :email="email"
    :api="api"
    :startProgress="startProgress"
    :endProgress="endProgress"
  />
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
    startProgress: Function,
    endProgress: Function,
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
