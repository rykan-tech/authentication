/**
 * Allows us to connect to the database
 */
import { Pool } from "pg";
import * as interfaces from "../util/interfaces";
import * as constants from "../util/constants";
import createLogger from "../util/logger";

const logger = createLogger("database");
const debug = logger.debug;

/**
 * Creates a PostgreSQL Pool to connect to the database, based on a conifig
 * @returns PostgreSQL Pool, used to make connections to the database
 */
export default (): Pool => {
	logger.info("Creating DB Pool...");
	debug("Checking if environment variables are being used...");
	// Check for all env variables excpet password one
	if (
		process.env.RYKAN_POSTGRES_USER &&
		process.env.RYKAN_POSTGRES_DATABASE &&
		process.env.RYKAN_POSTGRES_PORT &&
		process.env.RYKAN_POSTGRES_HOST
	) {
		logger.info("Using environment varibales for database config.");
		logger.warn("Database config file ignored.");
		return new Pool({
			user: process.env.RYKAN_POSTGRES_USER,
			password: process.env.RYKAN_POSTGRES_PASSWORD || "",
			database: process.env.RYKAN_POSTGRES_DATABASE,
			host: process.env.RYKAN_POSTGRES_HOST,
			port: parseInt(process.env.RYKAN_POSTGRES_PORT, 10),
		});
	}
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
	const environment = process.env.RYKAN_DB_ENV ||
		(process.env.NODE_ENV === "development" ? "development" : "production");
	debug(`Env: ${environment}`);
	const dbConfig = config[environment];
	if (typeof dbConfig === "undefined") {
		logger.error(`Asked for a non existant DB Environment of ${environment}.`);
		throw new Error(`None existant database environment specified (${environment})`);
	}
	logger.warn("Environment varibales may be used in your database config");
	// NOTE: Connection to DB is NOT tested here.
	// Environment variable override where defined
	return new Pool({
		user: process.env.RYKAN_POSTGRES_USER || dbConfig.username,
		password: process.env.RYKAN_POSTGRES_PASSWORD || dbConfig.password,
		database: process.env.RYKAN_POSTGRES_DATABASE || dbConfig.db_name,
		host: process.env.RYKAN_POSTGRES_HOST || dbConfig.host,
		port: process.env.RYKAN_POSTGRES_PORT ?
			parseInt(process.env.RYKAN_POSTGRES_PORT, 10) :
			dbConfig.port,
	});
};