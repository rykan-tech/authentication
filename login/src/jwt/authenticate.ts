/**
 * Issues a JSON Web Token (JWT)
 */
import pg from "pg";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import logger from "../util/logger";
import { DBSchema } from "../util/interfaces";

const debug = require("debug")("rykan:jwt");

function issueJWT(user: DBSchema) {
	debug("Singing a new JWT...");
	// generate JWT
	return jwt.sign({
		id: user.id,
		username: user.username,
	}, "oaosfdhiuawesdhfiu", { expiresIn: 60 * 15 });

}

function validatePassword(password: string, hash: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		logger.debug("Checking password with has from db...");
		bcrypt.compare(password, hash, (err, res) => {
			if (err) { reject(err); }
			resolve(res);
		});
	});
}

/**
 * Returned in the promise when authenticating in jwt/issue.ts
 */
export interface Authenticated {
	authenticated: boolean; // If false, username or password was wrong
	jwt?: string;
}

export default (username: string, password: string, database: pg.Pool): Promise<Authenticated> => {
	return new Promise((resolve, reject) => {
		// Stage 1: QUERY
		logger.debug("Querying database for JWT...");
		database.query(
			"SELECT * FROM userlogins WHERE username=$1", [
				username,
			],
			(err, res) => {
				if (err) { reject(err); }
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