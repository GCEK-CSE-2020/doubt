<template>
  <section>
    <div>
      <label>Topic:</label>
      <select v-model="topic">
        <option value="">All</option>
        <option value="lac" selected>Linear Algebra And Calculus</option>
        <option value="ec">Engineering Chemistry</option>
        <option value="eg">Engineering Graphics</option>
        <option value="bee">BEE/BEC</option>
        <option value="ls">Life Skill</option>
      </select>
    </div>
    <div>
      <label>Module:</label>
      <select v-model="module">
        <option value="">All</option>
        <option value="1" selected>Module 1</option>
        <option value="2">Module 2</option>
        <option value="3">Module 3</option>
        <option value="4">Module 4</option>
        <option value="5">Module 5</option>
      </select>
    </div>
    <div>
      <label>Status:</label>
      <select v-model="status">
        <option value="solved" selected>Solved</option>
        <option value="unsolved">Unsolved</option>
      </select>
    </div>
    <div>
      <label>Search:</label>
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
    <div>
      <input type="button" class="ask" @click="ask" value="Ask New Question" />
      <Ask
        v-bind:setAsk="setAsk"
        v-bind:fetchQuestions="fetchQuestions"
        v-bind:email="email"
        v-bind:api="api"
        v-if="asking"
      />
    </div>
    <div>
      <p @click="logout">Logout</p>
    </div>
    <div>
      <p @click="change">Change Password</p>
      <ChangePass
        v-bind:setChange="setChange"
        v-bind:email="email"
        v-if="changing"
      />
    </div>
  </section>
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
  },

  data() {
    return {
      topic: "lac",
      module: "1",
      status: "solved",
      search: "",
      asking: false,
      changing: false,
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

  onCreated() {
    this.fetchQuestions();
  },

  methods: {
    fetchQuestions() {
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
          if (json.status) {
            alert("Something Went Wrong");
          } else {
            this.setData(json);
          }
        }
      );
    },

    ask() {
      this.asking = true;
    },

    setAsk() {
      this.asking = false;
    },

    change() {
      this.changing = true;
    },

    setChange() {
      this.changing = false;
    },
  },
};
</script>

<style scoped>
div {
  float: left;
  margin: 0.5em;
}

input,
select {
  width: 15em;
  height: 2em;
  margin: 0.5em;
  background: #444;
  color: #fff;
  border: 1px solid #0075d2;
  border-radius: 0.125em;
  padding: 0.25em;
  box-shadow: 0.125em 0.125em 0.25em 0 rgba(0, 0, 0, 0.25);
}

.ask {
  width: 15em;
  background: #0075d2;
}

.search {
  width: 5em;
  height: 2em;
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
</style>
