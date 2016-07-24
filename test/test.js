import Router from "../src/router";
const $form1 = document.querySelector(".input-form");
const $input = document.querySelector(".input");
const $form2 = document.querySelector(".form2");
const $textarea = document.querySelector(".textarea");
const $message = document.querySelector(".message");
const $output = document.querySelector(".data-output");

window.router = new Router({
  index: false,
  result: {
    encode: function(data) {return data;},
    decode: function(str) {return str;}
  },
  obj: true
});

router.on("*", (route, data) => {
  console.log(`route: '${route}'. data: '${data}'`);
});

router.on("index", () => {
  console.log("index");
  $input.value = "";
});

router.on("result", msg => {
  console.log(`result: '${msg}'`);
  $message.textContent = msg;
});

router.on("obj", data => {
  console.log("obj:", data);
  $output.textContent = JSON.stringify(data);
});

$form1.addEventListener("submit", e => {
  e.preventDefault();
  let msg = $input.value;
  router.go("result", msg);
});

$form2.addEventListener("submit", e => {
  e.preventDefault();
  let str = $textarea.value;
  let obj = JSON.parse(str);
  router.go("obj", obj);
});
