import pg from "pg";
import appendEmail from "../util/add-suffix";
import { DB_USERS_TABLE_NAME } from "../util/constants";
import createLogger from "../util/logger";
import { hashPassword } from "./password";
import uuid = require("uuid");

const logger = createLogger("register");

/**
 * Registers a user to the database
 * @param email Email to use
 * @param password Plain text password
 * @param database database PostgreSQL database pool
 */
export default function registerUser(email: string, password: string, database: pg.Pool): Promise<void> {
	return new Promise((resolve, reject) => {
		// TODO: Add if user already exists checks
		// Auto append
		email = appendEmail(email);

		// Hash password
		hashPassword(password)
			.then((hash) => {
				// DO IT (add to DB)
				database.query(
					`INSERT INTO ${DB_USERS_TABLE_NAME} (email, password, user_id) VALUES ($1, $2, $3)`,
					[
						email,
						hash,
						uuid.v4(),
					],
					(err, res) => {
						if (err) {
							reject(err);
							return;
						}
						logger.info("New user added to the database.");
						resolve();
					},
				);
			})
			.catch(reject);
	});
}