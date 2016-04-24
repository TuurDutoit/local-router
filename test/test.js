import Router from "../router";

window.router = new Router({
  routes: {input: false, result: true},
  defaultRoute: "input"
});

router.on("*", (route, data) => {
  console.log(`route: '${route}'. data: '${data}'`);
});

router.on("input", () => {
  console.log("input");
});

router.on("result", data => {
  console.log(`result: '${data}'`);
});
