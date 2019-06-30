/**
 * Allows us to connect to the database
 */
import { Pool } from "pg";
import { readFileSync } from "fs";
import * as interfaces from "../util/interfaces";
import * as constants from "../util/constants";

const debug = require("debug")("rykan:database");

/**
 * Loads a database config from private/database.json
 * @returns DBConfig: Configuration object with the database environments.
 */
function loadDBConfig(): interfaces.DBConfig {
	debug("Reading DB config file...");
	// Load from file
	const rawData = readFileSync(constants.DB_CONFIG_PATH).toString();
	// Parse
	debug("Parsing JSON...");
	const config: interfaces.DBConfig = JSON.parse(rawData);
	return config;
}

/**
 * Creates a PostgreSQL Pool to connect to the database, based on a conifig
 * @returns PostgreSQL Pool, used to make connections to the database
 */
export default (): Pool => {
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
	debug("Got config.  Creating Pool...");
	const environment = process.env.RYKAN_DB_ENV ?
		process.env.RYKAN_DB_ENV : (process.env.NODE_ENV === "development" ? "development" : "production");
	const dbConfig = config[environment];
	if (typeof dbConfig === "undefined") {
		debug(`Asked for a non existant DB Environment of ${environment}.`);
		throw new Error(`None existant database environment specified (${environment})`);
	}
	// NOTE: Connection to DB is NOT tested here.
	return new Pool({
		user: dbConfig.username,
		password: dbConfig.password,
		database: dbConfig.db_name,
		host: dbConfig.host,
	});
};