/**
 * Entry point of microservice
 */
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import createLogger from "./util/logger";
import { connect as db_connect } from "./db";
import authenticate from "./auth";

const logger = createLogger("server");
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

// Middleware to allow us to easily send JSON messages

app.use((req, res, next) => {
	res.jsonMessage = (message: string) => {
		res.json({ message });
	};
	next();
});

// Make DB connection
logger.info("Creating DB pool...");
const database = db_connect();

// We define our single route here.
app.post("/login", (req, res, next) => {
	logger.info("Authenticating....");
	// Validate, are all fields present?
	if (!req.body.hasOwnProperty("email") || !req.body.hasOwnProperty("password")) {
		logger.error("Missing field in a request");
		res.statusCode = 422;
		res.jsonMessage("A required field was missing");
		res.end();
		return;
	}

	// Fields are there, Authenticate and issue a JWT.
	const jwt = authenticate(req.body.email, req.body.password, database)
		.then((authenticated) => {
			if (authenticated.authenticated) {
				logger.info("Authenticated successfully!");
				res.statusCode = 200;
				res.json({ jwt: authenticated.jwt });
				res.end();
			} else {
				logger.info("Authenticated unsuccessfully");
				res.statusCode = 401;
				res.jsonMessage("Invalid email or password");
				res.end();
			}
		})
		.catch(next);
});

// Allow a user to sign up
app.post("/signup", (req, res, next) => {
	res.statusCode = 501;
	res.jsonMessage("Signup not yet supported");
	res.end();
});

// For testing
export default app;