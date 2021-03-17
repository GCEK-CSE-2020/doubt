<template>
  <aside>
    <div class="grid">
      <label>Topic:</label>
      <select v-model="topic">
        <option value="lac" selected>Linear Algebra And Calculus</option>
        <option value="ec">Engineering Chemistry</option>
        <option value="eg">Engineering Graphics</option>
        <option value="bee">BEE/BEC</option>
        <option value="ls">Life Skill</option>
      </select>
      <label>Module:</label>
      <select v-model="module">
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
        api-key="3o38mbryyt3pos71f5rbt260nslesc2xzztmcp9cdzk33tku"
        :init="{
          menubar: false,
          height: '10em',
          width: '17em',
          resize: false,
          statusbar: false,
          skin: 'oxide-dark',
          content_css: 'dark',
          browser_spellcheck: true,
          plugins: 'autolink lists link image media',
          toolbar:
            'undo redo | bold italic underline | \
             image media link | bullist numlist removeformat',
          relative_urls: false,
        }"
      />
      <input type="button" @click="ask" value="Ask" />
      <input type="button" @click="setAsk" value="Cancel" />
    </div>
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
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
}

.grid {
  display: grid;
  text-align: center;
  background: #000;
  border: 1px solid #0075d2;
  border-radius: 0.125em;
  padding: 0.5em;
  box-shadow: 0.125em 0.125em 0.25em 0 rgba(0, 0, 0, 0.25);
}

input,
select {
  width: 20em;
  height: 2em;
  margin: 0.5em;
  background: #444;
  color: #fff;
  border: 1px solid #0075d2;
  border-radius: 0.125em;
  padding: 0.25em;
  box-shadow: 0.125em 0.125em 0.25em 0 rgba(0, 0, 0, 0.25);
}

input[type="button"] {
  width: 20.5em;
  height: 2.5em;
  background: #0075d2;
}

select {
  width: 20.5em;
}

input[type="text"] {
  height: 1.5em;
}
</style>

<style>
.tox-tinymce {
  border-radius: 0.125em !important;
  margin: 0.5em !important;
  box-shadow: 0.125em 0.125em 0.25em 0 rgba(0, 0, 0, 0.25) !important;
}
</style>
