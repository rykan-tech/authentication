import authenticate, { validatePassword, issueJWT } from "../src/auth";
import connect from "../src/db/connect";

import { expect, assert } from "chai";

import bcrypt from "bcrypt";
import { Pool } from "pg";
import { email, password, username } from "./constants";

let passwordHash: string;
let database: Pool;

describe("Authentication logic", () => {
	before((done) => {
		bcrypt.hash(password, 12, (err, hash) => {
			if (err) { done(err); }
			passwordHash = hash;
			done();
		});
	});

	before((done) => {
		database = connect();
		done();
	});

	describe("Password auth", () => {
		it("should return true if a password is valid", async () => {
			// tslint:disable-next-line:no-unused-expression
			expect(
				await validatePassword(password, passwordHash),
			).to.be.true;
		});

		it("should return false if a password is valid", async () => {
			// tslint:disable-next-line:no-unused-expression
			expect(
				await validatePassword(password + "nowInvalid", passwordHash),
			).to.be.false;
		});
	});

	describe("JSON Web Tokens", () => {

		it("should return a valid JWT with an expected payload", () => {
			// tslint:disable-next-line:no-console
			console.log("THIS SHOULD EVENTUALLY TEST AGAINST JSON SCHEMA");
			// tslint:disable-next-line:no-unused-expression
			expect(issueJWT({
				email: "rykantester",
				password,
				user_id: "some-uuid",
			})).to.be.string;
		});
	});

	describe("Full Authentication logic", () => {
		it("should fail to authenticate a non-existant user", async () => {
			const result = await authenticate("test123aljshasdf", "somepwd", database);
			expect(result).to.have.property("authenticated", false);
			expect(result).to.have.property("userExists", false);
		});

		it("should sucessfully authenticate a user and provide a JWT", async () => {
			const result = await authenticate(email, password, database);
			expect(result).to.have.property("authenticated", true);
			expect(result).to.have.property("jwt");
		});

		it("should sucessfully authenticate a user & append @rykanmail.com", async () => {
			const result = await authenticate(username, password, database);
			expect(result).to.have.property("authenticated", true);
			expect(result).to.have.property("jwt");
		});

		it("should fail to authenticate a user with the wrong password", async () => {
			const result = await authenticate(email, password + "notCorrect", database);
			expect(result).to.have.property("authenticated", false);
			expect(result).to.have.property("passwordCorrect", false);
		});

		it("should gracefully fail if there's an error querying the database", (done) => {
			const malformedDb = new Pool({
				user: "not_a_user",
				password: "not_a_password",
				host: "",
			});
			authenticate(email, password + "notCorrect", malformedDb)
				.then(() => {
					done(new Error("Expected method to reject"));
				})
				.catch((err) => {
					assert.isDefined(err);
					done();
				})
				.catch(done);
		});
	});
});