<template>
  <aside>
    <div>
      <p class="head">{{ details.question }}</p>
      <div v-html="details.description"></div>
      <label>Answer:</label>
      <div v-html="details.answer"></div>
      <input
        type="button"
        @click="deleteQuestion"
        value="Delete Question"
        v-if="details.email == email"
      />
      <input
        type="button"
        @click="deleteAnswer"
        value="Delete Answer"
        v-if="details.email == email || details.aemail == email"
      />
      <input
        type="button"
        @click="wrong"
        value="This Answer Is Wrong"
        v-if="details.email != email"
      />
      <input type="button" @click="setSolved" value="Close" />
    </div>
  </aside>
</template>

<script>
import fetchData from "../scripts/fetchData";

export default {
  name: "Ask",

  props: {
    setSolved: Function,
    details: Object,
    email: String,
    api: String,
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
            this.setSolved();
            document.querySelector(".search").click();
            alert("Successfully Deleted");
          } else {
            alert("Server Error");
          }
        }
      );
    },

    deleteAnswer() {
      fetchData(
        "delete_answer",
        {
          question: this.details.question,
          email: this.email,
          pass: this.api,
        },
        (json) => {
          if (json.status == "true") {
            this.setSolved();
            document.querySelector(".search").click();
            alert("Successfully Deleted");
          } else {
            alert("Server Error");
          }
        }
      );
    },

    wrong() {
      fetchData(
        "wrong",
        {
          question: this.details.question,
          email: this.email,
          pass: this.api,
        },
        (json) => {
          if (json.status == "true") {
            this.setSolved();
            alert("Successfully Informed to Responsible Team");
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

input {
  width: 20.5em;
  height: 2.5em;
  background: #0075d2;
  margin: 0.5em;
  color: #fff;
  border: 1px solid #0075d2;
  border-radius: 0.125em;
  padding: 0.25em;
  box-shadow: 0.125em 0.125em 0.25em 0 rgba(0, 0, 0, 0.25);
}

.head {
  font-size: 1.2em;
  font-weight: bold;
  color: #0075d2;
}
</style>
