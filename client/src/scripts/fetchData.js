export default function fetchData(url, postData, func) {
  fetch("https://gcekcse2020.herokuapp.com/" + url, {
    method: "POST",
    body: JSON.stringify(postData),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then(func);
}
