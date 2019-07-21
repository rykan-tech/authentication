/**
 * Entry point of microservice
 */
import express from "express";
import * as constants from "./util/constants";
import server from "./server";
import createLogger from "./util/logger";

const logger = createLogger("server");

// Uncaught excpetion handler, register first
process.on("unhandledRejection", (err) => {
	logger.error("An uncaught promise rejection was encountered!");
	throw err;
});

const app = express();
app.use(server);

app.listen(constants.PORT, () => {
	logger.info(`Running on port ${constants.PORT}.`);
});

// For testing
export default app;