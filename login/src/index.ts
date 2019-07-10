/**
 * Entry point of microservice
 */
import express from "express";
import * as constants from "./util/constants";
import server from "./server";
import logger from "./util/logger";

const app = express();
app.use(server);

app.listen(constants.PORT, () => {
	logger.info(`Running on port ${constants.PORT}.`);
});

// For testing
export default app;