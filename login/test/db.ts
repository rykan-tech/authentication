import connect from "../src/db/connect";
import { DB_CONFIG_PATH } from "../src/util/constants";

import { Pool } from "pg";
import { expect } from "chai";
import { DBConfig } from "../src/util/interfaces";

// Apparently Pool doesn't contain options in its definition
interface Pool2 extends Pool {
	options?: any;
}

describe("Database tests", () => {
	describe("Pool creation", () => {
		it("should sucessfully create a pool", () => {
			const res = connect();
			expect(res).to.be.an.instanceof(Object);
		});

		it("should retrieve the production env if RYKAN_DB_ENV is not specified & NODE_ENV is production", () => {
			process.env.RYKAN_DB_ENV = "";
			process.env.NODE_ENV = "production";
			const res: Pool2 = connect();
			const config: DBConfig = require(DB_CONFIG_PATH);
			expect(res.options.user).to.equal(config.production.username);
			expect(res.options.password).to.equal(config.production.password);
			expect(res.options.database).to.equal(config.production.db_name);
			expect(res.options.host).to.equal(config.production.host);
		});

		it("should retrieve the development env if RYKAN_DB_ENV is not specified & NODE_ENV is development", () => {
			process.env.RYKAN_DB_ENV = "";
			process.env.NODE_ENV = "development";
			const res: Pool2 = connect();
			const config: DBConfig = require(DB_CONFIG_PATH);
			expect(res.options.user).to.equal(config.development.username);
			expect(res.options.password).to.equal(config.development.password);
			expect(res.options.database).to.equal(config.development.db_name);
			expect(res.options.host).to.equal(config.development.host);
		});

		it("should retrieve a specific env if RYKAN_DB_ENV is specified", () => {
			process.env.RYKAN_DB_ENV = "test";
			const res: Pool2 = connect();
			const config: DBConfig = require(DB_CONFIG_PATH);
			expect(res.options.user).to.equal(config.test.username);
			expect(res.options.password).to.equal(config.test.password);
			expect(res.options.database).to.equal(config.test.db_name);
			expect(res.options.host).to.equal(config.test.host);
		});

		it("should throw an error when a non-existant database environment is used", () => {
			process.env.RYKAN_DB_ENV = "some-non-existant-db-123";
			expect(() => connect()).to.throw(`None existant database environment specified (${process.env.RYKAN_DB_ENV})`);
		});
	});
});