/**
 * Contains constants for the app
 */
import { join } from "path";

export const PORT = 2000;
export const LOG_LEVEL = process.env.NODE_ENV === "production" ? "info" : "debug";

export const PRIVATE_FILES = join(__dirname, "../../private");

// DB Stuff
export const DB_CONFIG_PATH = join(PRIVATE_FILES, "database.json");