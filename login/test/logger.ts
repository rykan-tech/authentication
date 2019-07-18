import createLogger from "../src/util/logger";

import { expect } from "chai";

/**
 * Logger tests
 */

describe("Logger tests", () => {
	it("should use silent mode when RYKAN_LOG_SILENT is true & NODE_ENV is test", () => {
		process.env.RYKAN_LOG_SILENT = "true";
		process.env.NODE_ENV = "test";
		const logger = createLogger("test");
		// tslint:disable-next-line: no-unused-expression
		expect(logger.transports[0].silent).to.be.true;
	});

	it("should use silent mode when RYKAN_LOG_SILENT is true & NODE_ENV is not test", () => {
		process.env.RYKAN_LOG_SILENT = "true";
		process.env.NODE_ENV = "development";
		const logger = createLogger("test");
		// tslint:disable-next-line: no-unused-expression
		expect(logger.transports[0].silent).to.be.true;
	});

	it("should use silent mode when RYKAN_LOG_SILENT is false & NODE_ENV is test", () => {
		process.env.RYKAN_LOG_SILENT = "false";
		process.env.NODE_ENV = "test";
		const logger = createLogger("test");
		// tslint:disable-next-line: no-unused-expression
		expect(logger.transports[0].silent).to.be.true;
	});

	it("should not use silent mode when RYKAN_LOG_SILENT is false & NODE_ENV is not test", () => {
		process.env.RYKAN_LOG_SILENT = "false";
		process.env.NODE_ENV = "development";
		const logger = createLogger("test");
		// tslint:disable-next-line: no-unused-expression
		expect(logger.transports[0].silent).to.be.false;
	});
});