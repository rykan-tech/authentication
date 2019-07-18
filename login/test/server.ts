import app from "../src/server";
import { JWTSchema } from "../src/util/interfaces";

import { expect } from "chai";
import request from "supertest";
import { decode } from "jsonwebtoken";
import { join } from "path";
import cookie from "cookie";
import { email, password, username } from "./constants";
import { COOKIE_JWT_NAME, COOKIE_XSRF_NAME } from "../src/util/constants";

// tslint:disable-next-line: no-var-requires
const jwtSchema = require(join(__dirname, "../../defs/auth/securitySchemes/jwt.json"));
// tslint:disable-next-line: no-var-requires
const response200Schema = require(join(__dirname, "../../defs/auth/schemas/jwt-return.json"));

describe("Server intergration tests", () => {
	describe("POST /login", () => {

		// RAML COMPLIANCE TESTS
		it("should return a JWT, which matches the schema", (done) => {
			// MAKE IT
			request(app)
				.post("/login")
				.send({ email: username, password })
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect(200)
				.end((err, res) => {
					if (err) { return done(err); }
					const jwtCookie = res.header["set-cookie"][1]; // 2nd cookie should be JWT
					const jwtEncoded = cookie.parse(jwtCookie);

					// Hacky typecast
					const jwtPayload: any = decode(jwtEncoded[COOKIE_JWT_NAME]); // Decoded
					const jwt: JWTSchema = jwtPayload;

					// tslint:disable-next-line: no-unused-expression
					expect(jwt).to.be.jsonSchema(jwtSchema);
					done();
				});
		});

		it("should return a JWT string when correct stuff supplied, with response complying with schema", (done) => {
			// MAKE IT
			request(app)
				.post("/login")
				.send({ email, password })
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect(200)
				.end((err, res) => {
					if (err) { return done(err); }
					expect(res.body).to.haveOwnProperty("isAuthenticated");
					expect(res.body.isAuthenticated).to.equal(true);

					const jwtCookie = res.header["set-cookie"][1]; // 2nd cookie should be JWT
					const jwt = cookie.parse(jwtCookie);
					expect(jwt).to.haveOwnProperty(COOKIE_JWT_NAME);
					expect(jwt[COOKIE_JWT_NAME]).to.match(/[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?/);

					// JSON schema validate
					expect(res.body).to.be.jsonSchema(response200Schema);
					done();
				});
		});

		// END RAML COMPLIANCE TESTS

		it("should return a JWT string when correct stuff supplied, with @rykanmail.com appended", (done) => {
			// MAKE IT
			request(app)
				.post("/login")
				.send({ email: username, password })
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect(200)
				.end((err, res) => {
					if (err) { return done(err); }
					const jwtCookie = res.header["set-cookie"][1]; // 2nd cookie should be JWT
					const jwtEncoded = cookie.parse(jwtCookie);

					// Hacky typecast
					const jwtPayload: any = decode(jwtEncoded[COOKIE_JWT_NAME]); // Decoded
					const jwt: JWTSchema = jwtPayload;

					// tslint:disable-next-line: no-unused-expression
					expect(jwt.user.email).to.be.equal(email);
					// UUID not tested as we don't know what it is
					done();
				});
		});

		it("should return an xsrf token on successful auth", (done) => {
			request(app)
				.post("/login")
				.send({ email, password })
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect(200)
				.end((err, res) => {
					if (err) { return done(err); }
					expect(res.body).to.haveOwnProperty("isAuthenticated");
					expect(res.body.isAuthenticated).to.equal(true);
					const xsrfCookie = res.header["set-cookie"][0];
					expect(cookie.parse(xsrfCookie)).to.haveOwnProperty(COOKIE_XSRF_NAME);
					done();
				});
		});

		it("should return a 422 when lack of 1 field given", (done) => {
			// MAKE IT
			request(app)
				.post("/login")
				.send({ email })
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect(422)
				.end((err, res) => {
					if (err) { return done(err); }
					expect(res.body).to.haveOwnProperty("message");
					expect(res.body).to.not.haveOwnProperty("jwt");
					done();
				});
		});

		it("should return a 401 when invalid email or password sent", (done) => {
			// MAKE IT
			request(app)
				.post("/login")
				.send({ email, password: password + "nowInvalid" })
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect(401)
				.end((err, res) => {
					if (err) { return done(err); }
					expect(res.body).to.haveOwnProperty("message");
					expect(res.body).to.not.haveOwnProperty("jwt");
					expect(res.body).to.haveOwnProperty("isAuthenticated");
					expect(res.body.isAuthenticated).to.equal(false);
					done();
				});
		});
	});
});
