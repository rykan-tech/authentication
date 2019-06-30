/**
 * Issues a JSON Web Token (JWT)
 */
import pg from "pg";
import bcrypt from "bcrypt";
import issueJWT from "./issue";
import validatePassword from "./password";
import logger from "../util/logger";
import { DBSchema } from "../util/interfaces";

const debug = require("debug")("rykan:auth");

/**
 * Returned in the promise when authenticating in jwt/issue.ts
 */
export interface Authenticated {
	authenticated: boolean; // If false, username or password was wrong
	jwt?: string;
}

/**
 * Authenticates a user, by retrieveing their password hash from the database
 * and comparing it to the submitted password, using bcrypt
 * Returns a signed JSON Web Token for the user
 * @param  {string} username Username to check
 * @param  {string} password Password to check
 * @param  {pg.Pool} database PostgreSQL Database pool
 * @returns Promise with boolean of if authenticated, and the JWT (if applicable)
 */
export default (username: string, password: string, database: pg.Pool): Promise<Authenticated> => {
	return new Promise((resolve, reject) => {
		// Stage 1: QUERY
		logger.debug("Querying database for JWT...");
		database.query(
			"SELECT * FROM userlogins WHERE username=$1", [
				username,
			],
			(err, res) => {
				if (err) { reject(err); return; }
				if (res.rows.length <= 0) {
					logger.error("User was not found!");
					resolve({
						authenticated: false,
					});
					return;
				}
				const user: DBSchema = res.rows[0];
				// Validate PWD
				validatePassword(password, user.password)
					.then((isCorrect) => {
						if (isCorrect) {
							logger.debug("Password is correct.");
							resolve({
								authenticated: true,
								jwt: issueJWT(user),
							});
						} else {
							logger.debug("Password is incorrect!");
							resolve({
								authenticated: false,
							});
						}
					});
			},
		);
	});
};