/**
 * Contains constants for the app
 */
import { join } from "path";

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

// Schema
export const SCHEMA_SIGNUP = join(__dirname, "../../../defs/auth/schemas/profile-signup.json");

// Salt factor
export const BCRYPT_SALT = 12;