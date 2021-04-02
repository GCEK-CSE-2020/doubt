<template>
  <aside>
    <img src="/assets/back.svg" @click="setAsk" alt="Go Back" />
    <label>Topic:</label>
    <select v-model="topic" title="Select Your Topic">
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
      v-show="topic != 'common'"
    >
      <option value="1">Module 1</option>
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
      api-key="3o38mbryyt3pos71f5rbt260nslesc2xzztmcp9cdzk33tku"
      :init="{
        menubar: false,
        branding: false,
        resize: true,
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
import Editor from "@tinymce/tinymce-vue";

export default {
  name: "Ask",

  props: {
    socket: Object,
    setAsk: Function,
    email: String,
    api: String,
  },

  components: {
    Editor,
  },

  data() {
    return {
      topic: "common",
      module: "1",
      question: "",
      description: "",
    };
  },

  created() {
    this.socket.on("set", (json) => {
      if (json.status == "true") {
        this.setAsk();
      } else if (json.status == "check") {
        alert("This Question Is Already Asked");
      } else {
        alert("Server Error");
      }
    });
  },

  methods: {
    ask() {
      if (this.question && this.description) {
        this.socket.emit("set", {
          question: this.question,
          description: this.description,
          time: new Date().getTime(),
          topic: this.topic,
          module: this.module,
          email: this.email,
          pass: this.api,
        });
      } else {
        alert("All Fields Are Required");
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

aside > * {
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

input[type="button"] {
  background: #0075d2;
}

img {
  cursor: pointer;
  width: 1em;
  position: absolute;
  left: 1em;
  top: 1em;
  z-index: 4;
}

@media screen and (min-width: 450px) {
  img {
    position: absolute;
    left: calc(50vw - (225px - 1em));
    top: 1em;
  }
}
</style>

<style>
.tox-tinymce {
  margin: 1em auto !important;
  max-width: calc(450px - 2em) !important;
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
