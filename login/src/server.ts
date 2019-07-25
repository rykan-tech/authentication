/**
 * Entry point of microservice
 */
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import Ajv from "ajv";
import XSRF from "csrf";
import protobuf from "protobufjs";
import createLogger from "./util/logger";
import { connect as db_connect } from "./db";
import authenticate, { registerUser } from "./auth";
import {
	JWT_LIFETIME_HRS,
	COOKIE_XSRF_NAME,
	COOKIE_JWT_NAME,
	SCHEMA_SIGNUP,
	SQL_LOGINS_UNIQUNESS_EMAIL_NAME,
	RABBITMQ_EXCHANGES,
	PROTOBUF_GENERAL_USER_EVENTS,
} from "./util/constants";
import amqp_connect from "./rabbitmq/connect";
import { Channel, Connection } from "amqplib";
const logger = createLogger("server");
const app = express();
const ajv = new Ajv({
	allErrors: true,
});

// Define XSRF secret
const Token = new XSRF();
const secret = Token.secretSync();

// Signup validation
// NOTE: I have no idea what will happen when we start having many requests
// it may be that a race condition means
// errors another user encounters are leaked
// i.e.:
// Req 1: validates schema and writes errors to validateSignup
// Req 2: validates schema and writes errors to validateSignup
// Req 1: gets errors, but gets errors from Req2
// though this may be a missunderstanding of how nodejs works
// tslint:disable-next-line: no-var-requires
const signupSchema = require(SCHEMA_SIGNUP);
const validateSignup = ajv.compile(signupSchema);

// Load Protobuf for events user create
const userCreatedProto = protobuf
	.loadSync(PROTOBUF_GENERAL_USER_EVENTS.file)
	.lookupType(PROTOBUF_GENERAL_USER_EVENTS.name);

// Add middleware
// Helmet add several hardening features to help with security
// It is NOT a silver bullet though.
app.use(helmet());
// Morgan acts as a request logger
if (process.env.NODE_ENV === "test" || process.env.RYKAN_LOG_SILENT === "true") {
	// Don't use it!
} else if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
} else {
	app.use(morgan("common"));
}
// Cookies!
app.use(cookieParser());

// Add body-parser
app.use(bodyParser.json());

// Middleware to allow us to easily send JSON messages

app.use((req, res, next) => {
	res.jsonMessage = (message: string, extraJSON?: object) => {
		res.json({ message, ...extraJSON });
	};
	next();
});

// Make DB connection
logger.debug("Creating DB pool...");
const database = db_connect();

// Make RabbitMQ connection
let rabbitMqChannel: Channel;
let rabbitMqConnection: Connection;
amqp_connect()
.then(res => { rabbitMqChannel = res.channel; rabbitMqConnection = res.connection; });

// Kubernetes heartbeat
app.get("/", (req, res) => {
	res.statusCode = 200;
	res.jsonMessage("I am inevitable.", {
		heartbeat: true,
	});
});

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

				// XSRF set
				logger.debug("Setting XSRF token...");
				const token = Token.create(secret);
				res.cookie(COOKIE_XSRF_NAME, token, {
					maxAge: JWT_LIFETIME_HRS * 60 * 60 * 1000, // In ms
				});

				// JWT set
				logger.debug("Setting JWT Cookie...");
				res.cookie(COOKIE_JWT_NAME, authenticated.jwt, {
					maxAge: JWT_LIFETIME_HRS * 60 * 60 * 1000, // In ms
				});

				res.statusCode = 200;
				logger.debug("Sending response...");
				res.jsonMessage("JWT sent.", {
					isAuthenticated: true,
				});
				res.end();
			} else {
				logger.info("Authenticated unsuccessfully");
				res.statusCode = 401;
				res.jsonMessage("Invalid email or password", {
					isAuthenticated: false,
				});
				res.end();
			}
		})
		.catch(next);
});

// Allow a user to sign up
app.post("/signup", (req, res, next) => {
	logger.info("New user signup!");
	// Validate
	const isValid = validateSignup(req.body);
	if (!isValid) {
		logger.debug("User signup does not match schema! Detectcing cause(s)...");
		if (typeof validateSignup.errors !== "undefined" && validateSignup.errors !== null) {
			const missingFields: string[] = [];
			const badTypes: { [key: string]: string } = {}; // property: correctType
			for (const error of validateSignup.errors) {
				const params: any = error.params; // Hacky force type cast
				// handle missing properties
				if (error.keyword === "required" && params.hasOwnProperty("missingProperty")) {
					logger.debug(`Got missing property ${params.missingProperty}.`);
					missingFields.push(params.missingProperty);
				} else if (error.keyword === "type" && params.hasOwnProperty("type")) {
					// handle properties of wrong type
					logger.debug(`Got ${error.dataPath} as wrong type.`);
					badTypes[error.dataPath.split(".")[1]] = params.type;
				}
			}

			logger.debug("Detection finished, sending back...");
			res.statusCode = 422;
			res.jsonMessage("Signup data does not match schema!", {
				badTypes,
				missingFields,
				fullError: process.env.NODE_ENV === "development" ? validateSignup.errors : "hidden",
			});
			validateSignup.errors = []; // clear for security
			res.end();
			return;
		} else {
			// No errors yet invalid? INTERNAL SERVER ERROR.
			// Can't handle this
			next(new Error("There was an unknown error validating your signup info."));
			return;
		}
	} // isvalid

	// It's good! register it!
	registerUser(req.body.email, req.body.password, database)
		.then((user) => {
			res.statusCode = 200;
			res.jsonMessage("User added");
			res.end();
			logger.debug("Sending out a new user event (async, after req)...");
			// Serialse
			logger.debug("Serialising message...");
			const messageOBJ = { uuid: user.uuid, event: 0 };
			const verifyErr = userCreatedProto.verify(messageOBJ);
			if (verifyErr) {
				logger.error(`Error encountered validating data (protobuf): ${verifyErr}`);
			}
			// Forced any as TS defs say UInt8Array
			const eventMsg: any = userCreatedProto.encode(userCreatedProto.create(messageOBJ)).finish();
			rabbitMqChannel.publish(
				RABBITMQ_EXCHANGES.userEvents.name,
				"", // Doesn't matter as fanout exchange
				eventMsg,
			);
			logger.debug("Message sent.");
		})
		.catch((err) => {
			if (err.message.startsWith(
				`duplicate key value violates unique constraint \"${SQL_LOGINS_UNIQUNESS_EMAIL_NAME}\"`,
			)) {
				// Duplicate resource!
				res.statusCode = 409;
				res.jsonMessage("Duplicate username!", {
					note: "A duplicate UUID may have also been generated.",
				});
			} else {
				next(err);
			}
		});

	// TODO SEND OUT RABBITMQ events
});

// For testing
export default app;
export { rabbitMqConnection }; // Exported so tests can close it