import Router from "../router";
const $form = document.querySelector(".input-form");
const $input = document.querySelector(".input");
const $message = document.querySelector(".message");

window.router = new Router({
  index: false,
  result: true
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

$form.addEventListener("submit", e => {
  e.preventDefault();
  let msg = $input.value;
  router.go("result", msg);
});
