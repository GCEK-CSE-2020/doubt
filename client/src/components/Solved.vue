<template>
  <aside>
    <img
      src="../assets/back.svg"
      class="back"
      @click="setSolved"
      alt="Go Back"
    />
    <img
      src="../assets/menu.svg"
      class="menu"
      @click="drop = !drop"
      alt="Menu"
    />
    <ul class="drop" v-show="drop">
      <li class="share">Share</li>
      <li @click="deleteQuestion" v-if="details.email == email">
        Delete Question
      </li>
      <li
        @click="deleteAnswer"
        v-if="details.email == email || details.aemail == email"
      >
        Delete Answer
      </li>
      <li @click="wrong" v-if="details.email != email">This Answer Is Wrong</li>
    </ul>
    <div class="block">
      <label class="head">{{ details.question }}</label>
      <br />
      <span>{{ details.time }}</span>
      <div v-html="details.description"></div>
    </div>
    <div class="block">
      <label class="head">Answer</label>
      <br />
      <span>{{ details.atime }}</span>
      <div v-html="details.answer" class="detail"></div>
    </div>
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
import Comments from "./Comments";

export default {
  name: "Ask",

  props: {
    setSolved: Function,
    details: Object,
    email: String,
    api: String,
    startProgress: Function,
    endProgress: Function,
  },

  components: {
    Comments,
  },

  data() {
    return {
      drop: false,
    };
  },

  mounted() {
    if (navigator.share) {
      document.querySelector(".share").addEventListener("click", () => {
        navigator.share({
          title: "GCEK CSE 2020 FORUM",
          text: this.details.question, // Change Share Text Here
          url:
            "https://gcekcse2020.herokuapp.com/?q=" +
            encodeURIComponent(this.details.question), // Change URL Here
        });
      });
    } else {
      document.querySelector(".share").style.display = "none";
    }
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
              this.setSolved();
            } else {
              alert("Server Error");
            }
          }
        );
      }
    },

    deleteAnswer() {
      const conf = confirm("Are You Sure?");

      if (conf) {
        this.startProgress();
        fetchData(
          "delete_answer",
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
              this.setSolved();
            } else {
              alert("Server Error");
            }
          }
        );
      }
    },

    wrong() {
      const conf = confirm("Are You Sure?");

      if (conf) {
        this.startProgress();
        fetchData(
          "wrong",
          {
            question: this.details.question,
            email: this.email,
            pass: this.api,
          },
          (json) => {
            this.endProgress();
            if (json.status == "true") {
              alert("Successfully Informed to Responsible Team");
              this.setSolved();
            } else {
              alert("Server Error");
            }
          }
        );
      }
    },
  },
};
</script>

<style scoped>
aside {
  display: grid;
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
  max-width: calc(450px - 2em);
  height: 2em;
  margin: 0.5em auto;
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
  margin: 1em auto;
  padding: 0.5em 1em;
  background: #222;
  width: calc(100vw - 2em);
  max-width: calc(450px - 2em);
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

@media screen and (min-width: 450px) {
  .back {
    position: absolute;
    left: calc(50vw - (225px - 1em));
    top: 1em;
  }

  .menu {
    position: absolute;
    right: calc(50vw - (225px - 1em));
    top: 1em;
  }
}
</style>
