<template>
  <aside>
    <img
      src="../assets/back.svg"
      class="back"
      @click="setUnsolved"
      alt="Go Back"
    />
    <img
      src="../assets/menu.svg"
      class="menu"
      @click="drop = !drop"
      alt="Menu"
    />
    <ul class="drop" v-if="drop">
      <li @click="deleteQuestion" v-if="details.email == email">
        Delete Question
      </li>
      <li @click="subscribe" v-if="details.email != email">
        Subscribe For Answer
      </li>
    </ul>
    <div class="block">
      <label class="head">{{ details.question }}</label>
      <br />
      <span>{{ details.time }}</span>
      <div v-html="details.description"></div>
    </div>
    <label>Your Answer:</label>
    <editor
      v-model="answer"
      placeholder="Describe Your Answer Here"
      title="Describe Your Answer Here"
      api-key="3o38mbryyt3pos71f5rbt260nslesc2xzztmcp9cdzk33tku"
      :init="{
        menubar: false,
        branding: false,
        resize: 'both',
        width: 'calc(100vw - 2em)',
        height: '10em',
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
    <input type="button" @click="post" value="Post Answer" />
    <Comments
      :question="details.question"
      :email="email"
      :api="api"
      :startProgress="startProgress"
      :endProgress="endProgress"
    />
  </aside>
</template>

<script>
import fetchData from "../scripts/fetchData";
import Editor from "@tinymce/tinymce-vue";
import Comments from "./Comments";

export default {
  name: "Ask",

  props: {
    setUnsolved: Function,
    details: Object,
    email: String,
    api: String,
    startProgress: Function,
    endProgress: Function,
  },

  components: {
    Editor,
    Comments,
  },

  data() {
    return {
      answer: "",
    };
  },

  methods: {
    deleteQuestion() {
      const conf = confirm("Are You Sure?");

      if (conf) {
        this.startProgress();
        fetchData(
          "delete",
          {
            question: this.details.question,
            email: this.email,
            pass: this.api,
          },
          (json) => {
            this.endProgress();
            if (json.status == "true") {
              document.querySelector(".search").click();
              alert("Successfully Deleted");
              this.setUnsolved();
            } else {
              alert("Server Error");
            }
          }
        );
      }
    },

    post() {
      if (this.answer) {
        this.startProgress();
        fetchData(
          "update",
          {
            question: this.details.question,
            answer: this.answer,
            atime: new Date().toString(),
            aemail: this.email,
            pass: this.api,
          },
          (json) => {
            this.endProgress();
            if (json.status == "true") {
              document.querySelector(".search").click();
              this.setUnsolved();
            } else if (json.status == "check") {
              alert("This Question Is Already Answered");
            } else {
              alert("Server Error");
            }
          }
        );
      } else {
        alert("Welcome Naughty Human");
      }
    },

    subscribe() {
      this.startProgress();
      fetchData(
        "subscribe",
        {
          question: this.details.question,
          email: this.email,
          pass: this.api,
        },
        (json) => {
          this.endProgress();
          if (json.status == "true") {
            alert("Successfully Subscribed");
            this.setUnsolved();
          } else {
            alert("Server Error");
          }
        }
      );
    },
  },
};
</script>

<style scoped>
aside {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  width: 100vw;
  height: 100vh;
  padding-top: 2em;
  text-align: center;
  background: #000;
  overflow: auto;
}

input {
  width: calc(100vw - 2em);
  height: 2em;
  margin: 0.5em 1em;
  color: #fff;
  background: #0075d2;
  border: 1px solid #0075d2;
  border-radius: 0.25em;
  padding: 0.25em;
  box-shadow: 0.125em 0.125em 0.25em 0 rgba(0, 0, 0, 0.25);
}

.back {
  width: 1em;
  position: absolute;
  left: 1em;
  top: 1em;
  z-index: 4;
}

.menu {
  height: 1em;
  position: absolute;
  right: 1em;
  top: 1em;
  z-index: 4;
}

.drop {
  position: absolute;
  right: 1em;
  top: 1.5em;
  border-radius: 0.25em;
  z-index: 4;
  box-shadow: 0.125em 0.125em 0.25em 0 rgba(0, 0, 0, 0.25);
}

.drop li {
  list-style-type: none;
  background: #444;
  border-bottom: 1px solid #0075d2;
  padding: 1em;
}

.drop li:hover {
  background: #222;
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
