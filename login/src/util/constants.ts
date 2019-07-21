/**
 * Contains constants for the app
 */
import { join } from "path";
import { RabbitMQExchange } from "./interfaces";

export const PORT = 2000;
export const LOG_LEVEL = process.env.NODE_ENV === "development" ?
	"debug" :
	(process.env.NODE_ENV === "test" ? "none" : "info");

export const PRIVATE_FILES = join(__dirname, "../../private");

// DB Stuff
export const DB_CONFIG_PATH = join(PRIVATE_FILES, "database.json");
export const DB_USERS_TABLE_NAME = "logins";

// JWT stuff
export const JWT_LIFETIME_HRS = 2190; // 3 months
export const JWT_LIFETIME = `${JWT_LIFETIME_HRS}h`;
export const JWT_DEFAULT_PERMISSIONS = [
	"jwt",
];
export const JWT_SIGNING_ALGORITHM = "RS256";
export const JWT_SIGNING_KEY = join(__dirname, `../../private/jwt-${JWT_SIGNING_ALGORITHM.toLowerCase()}-private.pem`);

// Email
export const RYKAN_EMAIL_SUFFIX = "@rykanmail.com";

// Cookie name
// Changing these may break a few things
export const COOKIE_JWT_NAME = "_AuthRefresh";
export const COOKIE_XSRF_NAME = "_XSRFTokenRefresh";

export const API_DEFS_ROOT = process.env.RYKAN_API_DEFS_DIR ?
	process.env.RYKAN_API_DEFS_DIR : join(__dirname, "../../../defs");

// Schema
export const SCHEMA_SIGNUP = join(API_DEFS_ROOT, "auth/schemas/profile-signup.json");

// Protobuf
export const PROTOBUF_GENERAL_USER_CREATED = {
	file: join(API_DEFS_ROOT, "common/protobuf/user.proto"),
	name: "UserCreated",
};

// Salt factor
export const BCRYPT_SALT = 12;

// Uniquness constraint name that was set in the SQL build script
// When the table was made
export const SQL_LOGINS_UNIQUNESS_EMAIL_NAME = "uniqueness";

// Rabbitmq
export const RABBITMQ_ADDRESS = process.env.RYKAN_AMQP_ADDRESS || "amqp://localhost";
export const RABBITMQ_EXCHANGES: { [key: string]: RabbitMQExchange } = {
	userEvents: {
		description: "User events, such as creation & deletion",
		name: "general.user",
		options: {
			durable: true,
		},
		type: "direct",
		queues: {
			userCreated: {
				name: "general.user.created",
				description: "For users who have been created",
				options: {
					durable: true,
				},
			},
		},
	},
};