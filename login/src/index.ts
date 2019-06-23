/**
 * Entry point of microservice
 */
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import * as constants from "./util/constants";
import logger from "./util/logger";

const app = express();

// Add middleware
// Helmet add several hardening features to help with security
// It is NOT a silver bullet though.
app.use(helmet());
// Morgan acts as a request logger
// TODO: Don't use dev mode in prod
app.use(morgan("dev"));

app.listen(constants.PORT, () => {
  logger.info(`Running on port ${constants.PORT}.`);
});

app.get("/", (req, res) => {
  res.statusCode = 200;
  res.send("Hello World!");
  res.end();
});