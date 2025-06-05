import app from "../../app";
import request from 'supertest';
import { describe, expect, it, } from "vitest";

describe("GET /",()=>{
  it("it should response the GET method",async () => {
    const res = await request(app).get("/")
    expect(res.status).toBe(200)
  })
})