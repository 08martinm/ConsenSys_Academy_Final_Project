import express from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import path from "path";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
// import routes from "./routes";
// import db from "./db";
import envVars from "../config/envVars";
import webpackConfig from "../config/webpack/dev";

const {
  PORTS: { APP },
  NODE_ENV,
} = envVars;
const app = express();

app.use(logger(NODE_ENV === "production" ? "combined" : "dev"));
app.use(bodyParser.json());
// app.use("/", routes);
// Enable hot-reloading if not in "production"
if (NODE_ENV !== "production") {
  const compiler = webpack(webpackConfig);
  const wpMw = webpackDevMiddleware(compiler, {});
  const wpHMw = webpackHotMiddleware(compiler);
  app.use(wpMw);
  app.use(wpHMw);
}
app.use(express.static(path.join(__dirname, "/../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/dist/index.html"));
});

app.get("*", (req, res) => res.redirect("/"));

// async function syncDB() {
//   await db().sequelize.sync();
// }

// syncDB();

app.listen(APP, err => {
  if (err) throw err;
  console.log(`Server running on: localhost:${APP}`); // eslint-disable-line
});
