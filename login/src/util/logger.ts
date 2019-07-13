/**
 * Contains the logger we use
 */
import chalk from "chalk";
import stringify from "fast-safe-stringify";
import winston from "winston";
import * as constants from "./constants";

const { combine, colorize, printf, timestamp } = winston.format;

export default function createLogger(moduleName: string) {
	return winston.createLogger({
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
	});
}