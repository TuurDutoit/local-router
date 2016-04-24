import babel from "rollup-plugin-babel";


export default {
  entry: "router.js",
  format: "umd",
  plugins: [
    babel({
      include: ["router.js"],
      presets: ["es2015-rollup"]
    })
  ],
  moduleName: "Router"
};
