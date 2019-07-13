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
export const JWT_LIFETIME = "2190h"; // 3 months
export const JWT_DEFAULT_PERMISSIONS = [
	"jwt",
];

// Email
export const RYKAN_EMAIL_SUFFIX = "@rykanmail.com";