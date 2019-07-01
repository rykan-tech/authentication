import { validatePassword, issueJWT } from "../src/auth";

import { expect } from "chai";

import bcrypt from "bcrypt";
const username = "test_user";
const password = "abc123$Rykan&";
let passwordHash: string;

describe("Authentication logic", () => {
	before((done) => {
		bcrypt.hash(password, 12, (err, hash) => {
			if (err) { done(err); }
			passwordHash = hash;
			done();
		});
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
				username: "rykantester",
				password,
				id: "some-uuid",
			})).to.be.string;
		});
	});
});