import connect from "../src/db/connect";

import { Pool } from "pg";
import { expect } from "chai";

describe("Database tests", () => {
	describe("Pool creation", () => {
		it("should sucessfully create a pool", () => {
			const res = connect();
			expect(res).to.be.an.instanceof(Object);
		});
	});
});