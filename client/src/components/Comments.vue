<template>
  <div class="comments">
    <label>Comments</label>
    <div>
      <input
        type="text"
        v-model="comment"
        placeholder="Type Your Comment Here"
        title="Type Your Comment Here"
      />
      <input type="button" @click="addComment" value="Add" />
    </div>

    <div class="one-comment" v-for="(comment, index) in comments" :key="index">
      <img src="../assets/comment.svg" alt="Comment" />
      <p>{{ comment }}</p>
    </div>
  </div>
</template>

<script>
import fetchData from "../scripts/fetchData";

export default {
  name: "Comments",

  props: {
    question: String,
    comments: Array,
    email: String,
    api: String,
    startProgress: Function,
    endProgress: Function,
    fetchComments: Function,
  },

  data() {
    return {
      comment: "",
    };
  },

  methods: {
    addComment() {
      if (this.comment) {
        this.startProgress();
        fetchData(
          "add_comment",
          {
            question: this.question,
            email: this.email,
            pass: this.api,
            comment: this.comment,
          },
          (json) => {
            this.endProgress();
            if (json.status == "true") {
              this.fetchComments();
            } else if (json.status == "check") {
              alert("This Comment Already Exists");
            } else {
              alert("server Error");
            }
          }
        );
      } else {
        alert("Type Something To Add");
      }
    },
  },
};
</script>

<style scoped>
.comments {
  width: 100vw;
  word-wrap: break-word;
}

.one-comment {
  width: calc(100vw - 2em);
  max-width: calc(450px - 2em);
  margin: 0.5em auto;
  height: auto;
  text-align: left;
}

label {
  font-size: 1.2em;
  color: #0075d2;
  font-weight: bold;
  text-align: center;
  margin: 1em 0;
}

input {
  width: calc(100vw - 8em);
  max-width: calc(450px - 8em);
  height: 2em;
  margin: none;
  background: #444;
  color: #fff;
  border: 1px solid #0075d2;
  border-radius: 0.25em;
  padding: 0.25em;
  box-shadow: 0.125em 0.125em 0.25em 0 rgba(0, 0, 0, 0.25);
}

input[type="button"] {
  width: 5em;
  height: 2em;
  margin: 0 0 0 1em;
  background: #0075d2;
}

img {
  width: 0.5em;
  margin-right: 0.5em;
  float: left;
}
</style>
