import { describe, expect, it } from "vitest";
import app from "../../app";
import request from "supertest";
// history
describe("GET /api/historical/trend", () => {
  const data = {
    fromDate: "2024-01-01",
    toDate: new Date(),
    fromCurrency: "USD",
    toCurrency: "INR",
  };

  it("should send 400 if any field is missing", async () => {
    const { fromDate, ...rest } = data;
    const res = await request(app).post("/api/historical/trend").send(rest);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

  it("should send 200", async () => {
    const res = await request(app).post("/api/historical/trend").send(data);
    expect(res.status).toBe(200);
  });
});

describe("GET /api/historical/current", () => {
  const data = {
    currency: "USD",
    date: "2025-05-27",
  };
  it("should send 400 if any required field is missing", async () => {
    const res = await request(app).post("/api/historical/current").send({});
    expect(res.status).toBe(400);
    expect(res.body.message).haveOwnProperty()
    expect(res.body.message).toBe("All fields are required");
  });

  it("should send 200 if all fields are correct",async()=>{
    const res = await request(app).post("/api/historical/current").send(data)
    expect(res.status).toBe(200)

  })
});
