<template>
  <aside>
    <img src="../assets/back.svg" @click="setAsk" alt="Go Back" />
    <label>Topic:</label>
    <select v-model="topic">
      <option value="common" selected>Common</option>
      <option value="lac">Linear Algebra And Calculus</option>
      <option value="ec">Engineering Chemistry</option>
      <option value="eg">Engineering Graphics</option>
      <option value="bee">BEE/BEC</option>
      <option value="ls">Life Skill</option>
    </select>
    <label v-show="topic != 'common'">Module:</label>
    <select v-model="module" v-show="topic != 'common'">
      <option value="">All</option>
      <option value="1" selected>Module 1</option>
      <option value="2">Module 2</option>
      <option value="3">Module 3</option>
      <option value="4">Module 4</option>
      <option value="5">Module 5</option>
    </select>
    <label>Question:</label>
    <input
      type="text"
      v-model="question"
      spellcheck="true"
      placeholder="Type Your Question Here"
      title="Type Your Question Here"
    />
    <label>Description:</label>
    <editor
      v-model="description"
      placeholder="Describe Your Question Here"
      title="Describe Your Question Here"
      api-key="no-api-key"
      :init="{
        menubar: false,
        branding: false,
        resize: 'both',
        width: 'calc(100vw - 2em)',
        height: '15em',
        skin: 'oxide-dark',
        content_css: 'dark',
        browser_spellcheck: true,
        plugins: 'autolink lists link image media',
        toolbar:
          'undo redo | bold italic underline |image media link | bullist numlist removeformat',
        relative_urls: false,
      }"
    />
    <input type="button" @click="ask" value="Ask" />
  </aside>
</template>

<script>
import fetchData from "../scripts/fetchData";
import Editor from "@tinymce/tinymce-vue";

export default {
  name: "Ask",

  props: {
    setAsk: Function,
    fetchQuestions: Function,
    email: String,
    api: String,
    startProgress: Function,
    endProgress: Function,
  },

  components: {
    Editor,
  },

  data() {
    return {
      topic: "lac",
      module: "1",
      question: "",
      description: "",
    };
  },

  methods: {
    ask() {
      if (this.question && this.description) {
        this.startProgress();
        fetchData(
          "set",
          {
            question: this.question,
            description: this.description,
            time: new Date().toString(),
            topic: this.topic,
            module: this.module,
            email: this.email,
            pass: this.api,
          },
          (json) => {
            this.endProgress();
            if (json.status == "true") {
              this.fetchQuestions();
              this.setAsk();
            } else if (json.status == "check") {
              alert("This Question Is Already Asked");
            } else {
              alert("Server Error");
            }
          }
        );
      } else {
        alert("Welcome Naughty Human");
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

input,
select {
  width: calc(100vw - 2em);
  height: 2em;
  margin: 0.5em 1em;
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
</style>

<style>
.tox-tinymce {
  margin: 1em !important;
}

.detail img {
  max-width: calc(100vw - 4em) !important;
  height: auto !important;
}

.detail iframe {
  max-width: calc(100vw - 4em) !important;
}

.block img {
  max-width: calc(100vw - 4em) !important;
  height: auto !important;
}

.block iframe {
  max-width: calc(100vw - 4em) !important;
}
</style>
