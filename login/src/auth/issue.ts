import jwt from "jsonwebtoken";
import { DBSchema } from "../util/interfaces";
import createLogger from "../util/logger";

const logger = createLogger("jwt");
const debug = logger.debug;

/**
 * Issues a new JSON Web Token,
 * signing it with the public key
 * @param {DBSchema} user the user (already authenticated) who the JWT is to be issued in
 */
export default function issueJWT(user: DBSchema) {
	debug(`Singing a new JWT in the name of ${user}...`);
	// generate JWT
	return jwt.sign({
		id: user.id,
		username: user.username,
	}, "oaosfdhiuawesdhfiu", { expiresIn: 60 * 15 });
}