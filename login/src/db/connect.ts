/**
 * Allows us to connect to the database
 */
import { Pool } from "pg";
import { promises } from "fs";
import * as interfaces from "../util/interfaces";
import * as constants from "../util/constants";

const debug = require("debug")("database");

async function loadDBConfig(): Promise<interfaces.DBConfig> {
	debug("Connecting to database...");
	debug("Reading DB config file...");
	// Load from file
	const rawData = (await promises.readFile(constants.DB_CONFIG_PATH)).toString();
	// Parse
	debug("Parsing JSON...");
	const config: interfaces.DBConfig = JSON.parse(rawData);
	return config;
}

export default async () => {
	debug("Connecting to database...");
	// Load config
	const config = await loadDBConfig();
	debug("Got config.  Establishing connecting to database...");
	const env = process.env.NODE_ENV === "development" ? config.development : config.production;
	return new Pool({
		user: env.username,
		password: env.password,
		database: env.db_name,
		host: env.host,
	});
};