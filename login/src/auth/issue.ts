import jwt from "jsonwebtoken";
import uuid from "uuid/v4";
import { DBSchema } from "../util/interfaces";
import createLogger from "../util/logger";
import { JWT_LIFETIME } from "../util/constants";

const logger = createLogger("jwt");
const debug = logger.debug;

// Will be replaced by public/private keypair
const secret = "oaosfdhiu$%^£OOAHJjaqhOIjPO";

/**
 * Issues a new JSON Web Token,
 * signing it with the public key
 * @param {DBSchema} user the user (already authenticated) who the JWT is to be issued in
 */
export default function issueJWT(user: DBSchema) {
	debug(`Singing a new JWT in the name of ${user}...`);
	// generate JWT
	return jwt.sign({
		jti: uuid(),
		user: {
			email: user.email,
			permissions: [
				"jwt",
			],
			user_id: user.user_id,
		},
	}, secret, { expiresIn: JWT_LIFETIME });
}