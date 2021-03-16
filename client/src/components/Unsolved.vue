<template>
  <aside>
    <div>
      <label class="head">{{ details.question }}</label>
      <div v-html="details.description"></div>
      <label v-if="details.email != email">Your Answer:</label>
      <editor
        v-model="answer"
        placeholder="Describe Your Answer Here"
        title="Describe Your Answer Here"
        api-key="3o38mbryyt3pos71f5rbt260nslesc2xzztmcp9cdzk33tku"
        :init="{
          menubar: false,
          height: '10em',
          width: '17em',
          resize: false,
          statusbar: false,
          skin: 'oxide-dark',
          content_css: 'dark',
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code',
          ],
          toolbar:
            'undo redo | bold italic backcolor | \
             bullist image link',
        }"
        v-if="details.email != email"
      />
      <input
        type="button"
        @click="deleteQuestion"
        value="Delete Question"
        v-if="details.email == email"
      />
      <input
        type="button"
        @click="post"
        value="Post Answer"
        v-if="details.email != email"
      />
      <input
        type="button"
        @click="subscribe"
        value="Subscribe For Answer"
        v-if="details.email != email"
      />
      <input type="button" @click="setUnsolved" value="Cancel" />
    </div>
  </aside>
</template>

<script>
import fetchData from "../scripts/fetchData";
import Editor from "@tinymce/tinymce-vue";

export default {
  name: "Ask",

  props: {
    setUnsolved: Function,
    details: Object,
    email: String,
    api: String,
  },

  components: {
    Editor,
  },

  data() {
    return {
      answer: "",
    };
  },

  methods: {
    deleteQuestion() {
      fetchData(
        "delete",
        {
          question: this.details.question,
          email: this.email,
          pass: this.api,
        },
        (json) => {
          if (json.status == "true") {
            this.setUnsolved();
            document.querySelector(".search").click();
            alert("Successfully Deleted");
          } else {
            alert("Server Error");
          }
        }
      );
    },

    post() {
      if (this.answer) {
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
            if (json.status == "true") {
              this.setUnsolved();
              document.querySelector(".search").click();
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
      fetchData(
        "subscribe",
        {
          question: this.details.question,
          email: this.email,
          pass: this.api,
        },
        (json) => {
          if (json.status == "true") {
            this.setUnsolved();
            alert("Successfully Subscribed");
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
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  min-height: 100vh;
  right: 0;
  display: grid;
  place-items: center;
}

div {
  display: grid;
  text-align: center;
  width: 18em;
  word-wrap: break-word;
  background: #000;
  border: 1px solid #0075d2;
  border-radius: 0.125em;
  padding: 0.5em;
  box-shadow: 0.125em 0.125em 0.25em 0 rgba(0, 0, 0, 0.25);
}

input,
textarea {
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

textarea {
  resize: none;
  width: 20em;
  height: 10em;
}

.head {
  font-size: 1.2em;
  font-weight: bold;
  color: #0075d2;
}
</style>
