<template>
  <div class="comments">
    <label>Comments</label>
    <form class="comment-div">
      <input
        type="text"
        v-model="comment"
        placeholder="Type Your Comment Here"
        title="Type Your Comment Here"
      />
      <input type="submit" @click="addComment" value="Add" />
    </form>

    <div class="one-comment" v-for="(comment, index) in comments" :key="index">
      <img src="/assets/comment.svg" alt="Comment" />
      <p>{{ comment }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Comments",

  props: {
    socket: Object,
    question: String,
    comments: Array,
    email: String,
    api: String,
    fetchComments: Function,
  },

  data() {
    return {
      comment: "",
    };
  },

  created() {
    this.socket.on("add_comment", (json) => {
      if (json.status == "check") {
        alert("This Comment Already Exists");
      }
    });
  },

  mounted() {
    this.socket.on("comments_updated", () => {
      this.fetchComments(this.question);
    });
  },

  methods: {
    addComment(e) {
      e.preventDefault();

      if (this.comment) {
        this.socket.emit("add_comment", {
          question: this.question,
          email: this.email,
          pass: this.api,
          comment: this.comment,
        });
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

.comment-div {
  margin: 0.5em auto;
}

label {
  font-size: 1.2em;
  color: #0075d2;
  font-weight: bold;
  text-align: center;
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

input[type="submit"] {
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
