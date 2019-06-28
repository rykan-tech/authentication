/**
 * Allows us to connect to the database
 */
import { Pool } from "pg";
import { readFileSync } from "fs";
import * as interfaces from "../util/interfaces";
import * as constants from "../util/constants";

const debug = require("debug")("rykan:database");

function loadDBConfig(): interfaces.DBConfig {
	debug("Reading DB config file...");
	// Load from file
	const rawData = readFileSync(constants.DB_CONFIG_PATH).toString();
	// Parse
	debug("Parsing JSON...");
	const config: interfaces.DBConfig = JSON.parse(rawData);
	return config;
}

export default () => {
	debug("Creating DB Pool...");
	// Load config
	let config: interfaces.DBConfig;
	try {
		config = loadDBConfig();
	} catch (err) {
		// Propogate up a scoop
		debug("ERROR connecting!");
		throw err;
	}

	// Create pool
	debug("Got config.  Create Pool...");
	const env = process.env.NODE_ENV === "development" ? config.development : config.production;
	// NOTE: Connection to DB is NOT tested here.
	return new Pool({
		user: env.username,
		password: env.password,
		database: env.db_name,
		host: env.host,
	});
};