/**
 * Entry point of microservice
 */
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import * as constants from "./util/constants";
import logger from "./util/logger";
import { connect as db_connect } from "./db";
import authenticate from "./auth";

const app = express();

// Add middleware
// Helmet add several hardening features to help with security
// It is NOT a silver bullet though.
app.use(helmet());
// Morgan acts as a request logger
// TODO: Don't use dev mode in prod
app.use(morgan("dev"));

// Add body-parser
app.use(bodyParser.json());

// Make DB connection
logger.info("Initiating DB connection...");
const database = db_connect();

app.listen(constants.PORT, () => {
	logger.info(`Running on port ${constants.PORT}.`);
});

// We define our single route here.
app.post("/", (req, res, next) => {
	logger.info("Authenticating....");
	// Validate, are all fields present?
	if (!req.body.hasOwnProperty("username") || !req.body.hasOwnProperty("password")) {
		logger.error("Missing field in a request");
		res.statusCode = 422;
		res.send("A required field was missing");
		res.end();
		return;
	}

	// Fields are there, Authenticate and issue a JWT.
	const jwt = authenticate(req.body.username, req.body.password, database)
		.then((authenticated) => {
			if (authenticated.authenticated) {
				logger.info("Authenticated successfully!");
				res.statusCode = 200;
				res.send(authenticated.jwt);
				res.end();
			} else {
				logger.info("Authenticated unsuccessfully");
				res.statusCode = 401;
				res.send("Invalid username or password");
				res.end();
			}
		})
		.catch(next);
});