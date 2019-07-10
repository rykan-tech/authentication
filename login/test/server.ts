import app from "../src/server";

import { expect } from "chai";
import request from "supertest";
import { username, password } from "./constants";

describe("Server intergration test", () => {
	describe("POST /login", () => {
		it("should return a JWT string when correct stuff supplied", (done) => {
			// MAKE IT
			request(app)
				.post("/login")
				.send({ username, password })
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect(200)
				.end((err, res) => {
					if (err) { return done(err); }
					expect(res.body).to.haveOwnProperty("jwt");
					expect(res.body.jwt).to.match(/[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?/)
					done();
				});
		});

		it("should return a 422 when lack of 1 field given", (done) => {
			// MAKE IT
			request(app)
				.post("/login")
				.send({ username })
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect(422)
				.end((err, res) => {
					if (err) { return done(err); }
					expect(res.body).to.haveOwnProperty("message");
					expect(res.body).to.not.haveOwnProperty("jwt");
					done();
				});
		});

		it("should return a 401 when invalid username or password sent", (done) => {
			// MAKE IT
			request(app)
				.post("/login")
				.send({ username, password: password + "nowInvalid" })
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect(401)
				.end((err, res) => {
					if (err) { return done(err); }
					expect(res.body).to.haveOwnProperty("message");
					expect(res.body).to.not.haveOwnProperty("jwt");
					done();
				});
		});
	});
});
