import app from "../src/server";
import { JWTSchema } from "../src/util/interfaces";
import connect from "../src/db/connect";

import { expect } from "chai";
import request from "supertest";
import { decode } from "jsonwebtoken";
import { join } from "path";
import cookie from "cookie";
import { email, password, username } from "./constants";
import { COOKIE_JWT_NAME, COOKIE_XSRF_NAME, DB_USERS_TABLE_NAME, API_DEFS_ROOT } from "../src/util/constants";

// tslint:disable-next-line: no-var-requires
const jwtSchema = require(join(API_DEFS_ROOT, "auth/securitySchemes/jwt.json"));
// tslint:disable-next-line: no-var-requires
const response200Schema = require(join(API_DEFS_ROOT, "auth/schemas/jwt-return.json"));
// tslint:disable-next-line: no-var-requires
const register422Schema = require(join(API_DEFS_ROOT, "auth/schemas/signup-422.json"));

const database = connect();
const emailForRegister = email + "register_integration_tests";
const userForRegister = {
	email: emailForRegister,
	password,
	name: "MyName",
	dob: "01/01/1970",
	recoveryEmail: "recovery@email.com",
	phone: "0118999881999119735",
};

describe("Server intergration tests", () => {

	describe("GET /", () => {
		it("should return a heartbeat", (done) => {
			request(app)
				.get("/")
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect(200)
				.end((err, res) => {
					if (err) { return done(err); }
					expect(res.body).to.haveOwnProperty("message");
					expect(res.body).to.haveOwnProperty("heartbeat");
					// tslint:disable-next-line: no-unused-expression
					expect(res.body.heartbeat).to.be.true;
					done();
				});
		});
	});

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

	describe("POST /signup", () => {

		it("should successfully add a user", (done) => {
			request(app)
				.post("/signup")
				.send(userForRegister)
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect(200)
				.end((err, res) => {
					if (err) { return done(err); }
					expect(res.body).to.haveOwnProperty("message");
					database.query(
						`SELECT email, user_id, password FROM ${DB_USERS_TABLE_NAME} WHERE email=$1`,
						[emailForRegister],
						// tslint:disable-next-line: no-shadowed-variable
						(err, res) => {
							if (err) { return done(err); }
							expect(res.rows).to.have.length(1);
							expect(res.rows[0].email).to.equal(emailForRegister);
							done();
						},
					);
				});
		});

		it("should return a list of missing fields", (done) => {
			request(app)
				.post("/signup")
				.send({ /* NOTHING */ })
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect(422)
				.end((err, res) => {
					if (err) { return done(err); }
					expect(res.body).to.be.jsonSchema(register422Schema);
					expect(res.body.badTypes).to.deep.equal({});
					expect(res.body.missingFields).to.deep.equal([
						"email",
						"password",
						"name",
						"phone",
						"recoveryEmail",
						"dob",
					]);
					done();
				});
		});

		it("should return a list of missing fields as well as bad types", (done) => {
			request(app)
				.post("/signup")
				.send({ email: 42, name: NaN })
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect(422)
				.end((err, res) => {
					if (err) { return done(err); }
					expect(res.body).to.be.jsonSchema(register422Schema);
					expect(res.body.badTypes).to.deep.equal({
						email: "string",
						name: "string",
					});
					expect(res.body.missingFields).to.deep.equal([
						"password",
						"phone",
						"recoveryEmail",
						"dob",
					]);
					done();
				});
		});

		it("should hide full error when NODE_ENV not development (schema validation)", (done) => {
			process.env.NODE_ENV = "production";
			request(app)
				.post("/signup")
				.send({ /* NOTHING */ })
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect(422)
				.end((err, res) => {
					if (err) { return done(err); }
					expect(res.body).to.haveOwnProperty("message");
					expect(res.body).to.haveOwnProperty("fullError");
					expect(res.body.fullError).to.equal("hidden");
					done();
				});
		});

		it("should not hide full error when NODE_ENV development (schema validation)", (done) => {
			process.env.NODE_ENV = "development";
			request(app)
				.post("/signup")
				.send({ /* NOTHING */ })
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect(422)
				.end((err, res) => {
					if (err) { return done(err); }
					expect(res.body).to.haveOwnProperty("message");
					expect(res.body).to.haveOwnProperty("fullError");
					expect(res.body.fullError).to.be.an.instanceof(Array);
					done();
				});
		});

		it("should return a 409 when we try to add a duplicate user", (done) => {
			request(app)
				.post("/signup")
				.send(userForRegister)
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect(409)
				.end((err, res) => {
					if (err) { return done(err); }
					expect(res.body).to.haveOwnProperty("message");
					done();
				});
		});

		// Cleanup
		after((done) => {
			database.query(
				`DELETE FROM ${DB_USERS_TABLE_NAME} WHERE email=$1`,
				[ emailForRegister ],
				(err, res) => {
					if (err) { return done(err); }
					done();
				},
			);
		});

	});
});
