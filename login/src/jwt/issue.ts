/**
 * Issues a JSON Web Token (JWT)
 */
import pg from "pg";
import jwt from "jsonwebtoken";
import logger from "../util/logger";
import { DBSchema } from "../util/interfaces";

const debug = require("debug")("rykan:jwt");

function issueJWT(user: DBSchema) {
	// generate JWT
	return jwt.sign({
		id: user.id,
		username: user.username,
	}, "oaosfdhiuawesdhfiu", { expiresIn: 60 * 15 });

}

export default (username: string, password: string, database: pg.Pool): Promise<string> => {
	return new Promise((resolve, reject) => {
		// Stage 1: QUERY
		database.query(
			"SELECT * FROM userlogins WHERE username=$1", [
				username,
			],
			(err, res) => {
				if (err) { reject(err); }
				resolve(issueJWT(res.rows[0]));
			},
		);
	});
};