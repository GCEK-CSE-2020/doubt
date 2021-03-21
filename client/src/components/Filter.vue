<template>
  <div class="filter">
    <div class="show-filter" v-show="filter">
      <label>Topic:</label>
      <select v-model="topic" title="Select Your Topic">
        <option value="">All</option>
        <option value="common">Common</option>
        <option value="lac">Linear Algebra And Calculus</option>
        <option value="ec">Engineering Chemistry</option>
        <option value="eg">Engineering Graphics</option>
        <option value="bee">BEE/BEC</option>
        <option value="ls">Life Skill</option>
      </select>
      <label v-show="topic != 'common'">Module:</label>
      <select
        v-model="module"
        title="Select Your Module"
        v-show="topic != 'common' && topic != ''"
      >
        <option value="">All</option>
        <option value="1">Module 1</option>
        <option value="2">Module 2</option>
        <option value="3">Module 3</option>
        <option value="4">Module 4</option>
        <option value="5">Module 5</option>
      </select>
      <label>Status:</label>
      <select v-model="status" title="Select Question Status">
        <option value="">All</option>
        <option value="solved">Solved</option>
        <option value="unsolved">Unsolved</option>
        <option value="email">Your Questions</option>
      </select>
      <label>Search:</label>
      <div>
        <input
          type="search"
          v-model="search"
          placeholder="Type Here To Search"
          title="Type Here To Search"
        />
        <input
          class="search"
          type="button"
          @click="fetchQuestions"
          value="search"
        />
      </div>
      <input
        type="button"
        class="ask"
        @click="asking = true"
        value="Ask A New Question"
      />

      <div>
        <p @click="logout">Logout</p>
        <p @click="changing = true">Change Password</p>
      </div>
    </div>
    <div class="control" @click="filter = !filter">
      <img src="../assets/hide.svg" alt="Hide Filter" v-if="filter" />
      <img src="../assets/show.svg" alt="Show Filter" v-else />
    </div>
  </div>

  <Ask
    :setAsk="setAsk"
    :fetchQuestions="fetchQuestions"
    :email="email"
    :api="api"
    v-if="asking"
    :startProgress="startProgress"
    :endProgress="endProgress"
  />

  <ChangePass
    :setChange="setChange"
    :email="email"
    :startProgress="startProgress"
    :endProgress="endProgress"
    v-if="changing"
  />
</template>

<script>
import fetchData from "../scripts/fetchData";
import Ask from "./Ask";
import ChangePass from "./ChangePass";

export default {
  name: "Filter",

  components: {
    Ask,
    ChangePass,
  },

  props: {
    setData: Function,
    logout: Function,
    email: String,
    api: String,
    startProgress: Function,
    endProgress: Function,
  },

  data() {
    return {
      topic: "",
      module: "",
      status: "",
      search: "",
      asking: false,
      changing: false,
      filter: false,
    };
  },

  watch: {
    topic() {
      this.fetchQuestions();
    },

    module() {
      this.fetchQuestions();
    },

    status() {
      this.fetchQuestions();
    },
  },

  mounted() {
    this.fetchQuestions();
  },

  methods: {
    fetchQuestions() {
      this.startProgress();
      fetchData(
        "get",
        {
          status: this.status,
          topic: this.topic,
          module: this.module,
          quest: this.search,
          email: this.email,
          pass: this.api,
        },
        (json) => {
          this.endProgress();
          if (json.status) {
            alert("Something Went Wrong");
          } else {
            this.setData(json);
          }
        }
      );
      this.filter = false;
    },

    setAsk() {
      this.asking = false;
    },

    setChange() {
      this.changing = false;
    },
  },
};
</script>

<style scoped>
.filter {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 2;
  background: #222;
  box-shadow: 0.125em 0.125em 0.25em 0 rgba(0, 0, 0, 0.25);
  text-align: center;
}

.show-filter {
  margin-top: 1em;
}

.show-filter > * {
  display: block;
}

input,
select {
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

.ask {
  background: #0075d2;
}

input[type="search"] {
  width: calc(100vw - 8em);
  margin: none;
  max-width: calc(450px - 8em);
}

.search {
  width: 5em;
  height: 2em;
  margin: 0 0 0 1em;
  background: #0075d2;
}

p {
  color: #0075d2;
  cursor: pointer;
  text-decoration: underline;
}

p:hover {
  color: #fff;
}

.control {
  cursor: pointer;
  width: 100vw;
  height: 2em;
  display: grid;
  place-items: center;
}

img {
  width: 1em;
}
</style>
