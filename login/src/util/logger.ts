/**
 * Contains the logger we use
 */
import chalk from "chalk";
import stringify from "fast-safe-stringify";
import winston from "winston";
import * as constants from "./constants";

const { combine, colorize, printf, timestamp } = winston.format;

export default function createLogger(moduleName: string) {
	const options: winston.LoggerOptions = {
		transports: [
			new winston.transports.Console({
				format: combine(
					colorize(),
					timestamp(),
					printf((info) => {
						return `${chalk.grey(info.timestamp)} ${chalk.magenta(moduleName)} ${info.level} ${info.message}`;
					}),
				),
				level: constants.LOG_LEVEL,
			}),
			new winston.transports.File({
				filename: "logs/log.log",
				format: combine(
					timestamp(),
					printf((info) => {
						info.moduleName = moduleName;
						return stringify(info);
					}),
				),
				level: "info",
			}),
		],
	};

	const newLogger = winston.createLogger(options);
	// Disable logging if testing
	if (process.env.RYKAN_LOG_SILENT === "true" || process.env.NODE_ENV === "test") {
		newLogger.transports[0].silent = true;  // turns off
	} else {
		newLogger.transports[0].silent = false;
	}

	return newLogger;
}