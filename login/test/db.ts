import connect from "../src/db/connect";
import { DB_CONFIG_PATH } from "../src/util/constants";

import { Pool } from "pg";
import { expect } from "chai";
import { DBConfig } from "../src/util/interfaces";

// Apparently Pool doesn't contain options in its definition
interface Pool2 extends Pool {
	options?: any;
}

// PWD not included
const DB_ENV_TEST_CONFIG = {
	RYKAN_POSTGRES_USER: "a_user",
	RYKAN_POSTGRES_DATABASE: "a_database",
	RYKAN_POSTGRES_HOST: "0.0.0.0",
	RYKAN_POSTGRES_PORT: "4200",
};

// Store starting environment variables
const oldEnv = process.env;

describe("Database tests", () => {
	describe("Pool creation", () => {

		afterEach(() => {
			// REVERT env changes
			process.env = oldEnv;
		});

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
			expect(res.options.port).to.equal(config.production.port);
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
			expect(res.options.port).to.equal(config.development.port);
		});

		it("should retrieve a specific env if RYKAN_DB_ENV is specified, regardless of NODE_ENV", () => {
			process.env.RYKAN_DB_ENV = "test";
			const res: Pool2 = connect();
			const config: DBConfig = require(DB_CONFIG_PATH);
			expect(res.options.user).to.equal(config.test.username);
			expect(res.options.password).to.equal(config.test.password);
			expect(res.options.database).to.equal(config.test.db_name);
			expect(res.options.host).to.equal(config.test.host);
			expect(res.options.port).to.equal(config.test.port);
		});

		it("should use environment variables when all except RYKAN_POSTGRES_PASSWORD and use a blank password", () => {
			process.env = { ...process.env, ...DB_ENV_TEST_CONFIG }; // Add env
			const res: Pool2 = connect();
			const config: DBConfig = require(DB_CONFIG_PATH);
			expect(res.options.user).to.equal(DB_ENV_TEST_CONFIG.RYKAN_POSTGRES_USER);
			expect(res.options.password).to.equal("");
			expect(res.options.database).to.equal(DB_ENV_TEST_CONFIG.RYKAN_POSTGRES_DATABASE);
			expect(res.options.host).to.equal(DB_ENV_TEST_CONFIG.RYKAN_POSTGRES_HOST);
			expect(res.options.port).to.equal(parseInt(DB_ENV_TEST_CONFIG.RYKAN_POSTGRES_PORT, 10));
		});

		it("should use all environment variables when they are specified", () => {
			process.env = { ...process.env, ...DB_ENV_TEST_CONFIG, RYKAN_POSTGRES_PASSWORD: "a_password123" }; // Add env
			const res: Pool2 = connect();
			const config: DBConfig = require(DB_CONFIG_PATH);
			expect(res.options.user).to.equal(DB_ENV_TEST_CONFIG.RYKAN_POSTGRES_USER);
			expect(res.options.password).to.equal("a_password123");
			expect(res.options.database).to.equal(DB_ENV_TEST_CONFIG.RYKAN_POSTGRES_DATABASE);
			expect(res.options.host).to.equal(DB_ENV_TEST_CONFIG.RYKAN_POSTGRES_HOST);
			expect(res.options.port).to.equal(parseInt(DB_ENV_TEST_CONFIG.RYKAN_POSTGRES_PORT, 10));
		});

		it("should still use config variables if not all env vars are set", () => {
			process.env = { ...process.env, ...DB_ENV_TEST_CONFIG, RYKAN_POSTGRES_DATABASE: undefined }; // Add env
			process.env.RYKAN_DB_ENV = "test"; // so we have predictable results
			const res: Pool2 = connect();
			const config: DBConfig = require(DB_CONFIG_PATH);
			expect(res.options.user).to.equal(DB_ENV_TEST_CONFIG.RYKAN_POSTGRES_USER);
			expect(res.options.password).to.equal(config.test.password);
			expect(res.options.database).to.equal(config.test.db_name);
			expect(res.options.host).to.equal(DB_ENV_TEST_CONFIG.RYKAN_POSTGRES_HOST);
			expect(res.options.port).to.equal(parseInt(DB_ENV_TEST_CONFIG.RYKAN_POSTGRES_PORT, 10));
		});

		it("should throw an error when a non-existant database environment is used", () => {
			process.env.RYKAN_DB_ENV = "some-non-existant-db-123";
			expect(() => connect()).to.throw(`None existant database environment specified (${process.env.RYKAN_DB_ENV})`);
		});
	});
});