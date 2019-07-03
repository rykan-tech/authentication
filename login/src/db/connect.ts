/**
 * Allows us to connect to the database
 */
import { Pool } from "pg";
import * as interfaces from "../util/interfaces";
import * as constants from "../util/constants";

const debug = require("debug")("rykan:database");

/**
 * Creates a PostgreSQL Pool to connect to the database, based on a conifig
 * @returns PostgreSQL Pool, used to make connections to the database
 */
export default (): Pool => {
	debug("Creating DB Pool...");
	debug("Reading DB config file...");
	// Load config
	let config: interfaces.DBConfig;
	try {
		config = require(constants.DB_CONFIG_PATH);
	} catch (err) {
		// Propogate up a scoop
		debug("ERROR reading config files!");
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