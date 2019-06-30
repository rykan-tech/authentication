import { validatePassword } from "../src/auth";
import authenticate from "../src/auth";

import { expect } from "chai";

import bcrypt from "bcrypt";
const password = "abc123$Rykan&";
let passwordHash: string;

describe("Tests authentication logic", () => {
	before((done) => {
		bcrypt.hash(password, 12, (err, hash) => {
			if (err) { done(err); }
			passwordHash = hash;
			done();
		});
	});

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