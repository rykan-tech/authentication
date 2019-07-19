/**
 * Registration (signup) tests
 */
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { registerUser } from "../src/auth";
import connect from "../src/db/connect";
import { password, username } from "./constants";
import { DB_USERS_TABLE_NAME } from "../src/util/constants";
import appendEmail from "../src/util/add-suffix";

const database = connect();
const email = appendEmail(username + "_register");

chai.use(chaiAsPromised);

describe("Registration (signup) test", () => {

	it("should successfully add a user to the database, with email suffix", (done) => {
		registerUser(username + "_register", password, database)
			.then(() => {
				database.query(
					`SELECT email, user_id, password FROM ${DB_USERS_TABLE_NAME} WHERE email=$1`,
					[email],
					(err, res) => {
						if (err) { return done(err); }
						expect(res.rows).to.have.length(1);
						expect(res.rows[0].email).to.equal(email);
						done();
					},
				);
			})
			.catch(done);
	});

	it("should handle errors into the reject", () => {
		// Exceed max limits
		expect(registerUser(username + "_register" + "a".repeat(320), password, database)).to.eventually.rejectedWith(Error);
	});

	// Cleanup
	after((done) => {
		database.query(
			`DELETE FROM ${DB_USERS_TABLE_NAME} WHERE email=$1`,
			[ email ],
			(err, res) => {
				if (err) { return done(err); }
				done();
			},
		);
	});
});
