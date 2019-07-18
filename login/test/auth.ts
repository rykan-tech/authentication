import authenticate, { validatePassword, issueJWT } from "../src/auth";
import connect from "../src/db/connect";
import { email, password, username } from "./constants";
import { readFileSync } from "fs";

import chai, { expect, assert } from "chai";

import bcrypt from "bcrypt";
import { Pool } from "pg";
import { decode, verify } from "jsonwebtoken";
import { join } from "path";
import { JWTSchema } from "../src/util/interfaces";
import { JWT_SIGNING_KEY } from "../src/util/constants";


// tslint:disable-next-line: no-var-requires
const jwtSchema = require(join(__dirname, "../../defs/auth/securitySchemes/jwt.json"));

const pubKey = readFileSync(join(__dirname, "../private/jwt-es256-public.pem"));

let passwordHash: string;
let database: Pool;

// tslint:disable-next-line: no-var-requires
chai.use(require("chai-json-schema"));

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
		it("should return a valid JWT with an expected payload, matching the schema in defs/", () => {
			// tslint:disable-next-line:no-unused-expression
			const jwtStr = issueJWT({
				email,
				password,
				user_id: "some-uuid",
			});
			// Hacky typecast
			const jwtPayload: any = decode(jwtStr); // Decoded
			const jwt: JWTSchema = jwtPayload;

			// tslint:disable-next-line: no-unused-expression
			expect(jwtStr).to.be.string;
			expect(jwtStr).to.match(/[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?/);
			expect(jwt).to.be.jsonSchema(jwtSchema);
			expect(jwt.user.email).to.be.equal(email);
			expect(jwt.user.user_id).to.be.equal("some-uuid");
		});

		it("should return a valid JWT signing with the appropriate algorithm", (done) => {
			const jwtStr = issueJWT({
				email,
				password,
				user_id: "some-uuid",
			});
			// Hacky typecast
			const jwtPayload: any = decode(jwtStr, { complete: true }); // Decoded
			expect(jwtPayload.header.alg).to.equal("ES256");
			verify(jwtStr, pubKey, (err) => {
				done(err);
			});
			//expect(() => verify(jwtStr, secret)).to.not.throw();
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