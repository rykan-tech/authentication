/**
 * Contains the logger we use
 */
import winston from "winston";
import * as constants from "./constants";

export default winston.createLogger({
	transports: [
		new winston.transports.Console({
			format: winston.format.cli(),
			level: constants.LOG_LEVEL,
		}),
		new winston.transports.File({
			filename: "logs/log.log",
			level: "info",
		}),
	],
});