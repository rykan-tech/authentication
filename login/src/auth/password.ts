/**
 * Validates a password, by checking it against the DB hash
 */
import bcrypt from "bcrypt";
import createLogger from "../util/logger";
import { BCRYPT_SALT } from "../util/constants";

const logger = createLogger("auth:pwd");
const debug = logger.debug;
/**
 * Validates a password, by checking its hash in the database using bcrypt
 * @param  {string} password The password to check
 * @param  {string} hash User's actual password hash, retrieved from the database
 * @returns Promise with boolean of if the password is correct or not
 */
export function validatePassword(password: string, hash: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		debug("Checking password with hash (from db)...");
		bcrypt.compare(password, hash, (err, res) => {
			if (err) { reject(err); return; }
			resolve(res);
		});
	});
}

export function hashPassword(password: string): Promise<string> {
	return new Promise((resolve, reject) => {
		debug("Hashing password...");
		bcrypt.hash(password, BCRYPT_SALT, (err, res) => {
			if (err) { reject(err); return; }
			resolve(res);
		});
	});
}