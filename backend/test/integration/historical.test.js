import { describe, expect, it } from "vitest";
import app from "../../app";
import request from "supertest";

// history
describe("GET /historical", () => {
  const data = {
    fromDate: "2024-01-01",
    toDate: new Date(),
    fromCurrency: "USD",
    toCurrency: "INR",
  };

  it("should send 400 if any field is missing", async () => {
    const {fromDate,...rest} = data
    const res = await request(app)
      .post("/historical")
      .send(rest);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

  it("should send 200", async () => {
    const res = await request(app)
      .post("/historical")
      .send(data);
    expect(res.status).toBe(200);
  });
});
