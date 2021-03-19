<template>
  <div class="comments">
    <label>Comments</label>
    <input
      type="text"
      v-model="comment"
      placeholder="Type Your Comment Here"
      title="Type Your Comment Here"
    />
    <input type="button" @click="addComment" value="Add" />
    <div v-for="(comment, index) in comments" :key="index">
      <span>=> </span>
      <p>{{ comment }}</p>
      <br />
    </div>
  </div>
</template>

<script>
import fetchData from "../scripts/fetchData";

export default {
  name: "Comments",

  props: {
    question: String,
    email: String,
    api: String,
    startProgress: Function,
    endProgress: Function,
  },

  data() {
    return {
      comments: [],
      comment: "",
    };
  },

  onMounted() {
    this.fetchComments();
  },

  methods: {
    fetchComments() {
      this.startProgress();
      fetchData(
        "get_comments",
        {
          question: this.question,
          email: this.email,
          pass: this.api,
        },
        (json) => {
          this.endProgress();
          if (json.status == true) {
            this.comments = json.comments;
          } else {
            alert("server Error");
          }
        }
      );
    },

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

label {
  color: #0075d2;
  font-weight: bold;
  text-align: center;
  margin-top: 1em;
}

input {
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
  width: 5em;
  height: 2em;
  margin: 0.5em auto;
  background: #0075d2;
}

span {
  font-size: 0.75em;
  color: #999;
  float: left;
}
</style>
