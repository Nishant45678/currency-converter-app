import { describe, expect, it} from "vitest"
import app from "../../app.js"
import request from "supertest"


describe("GET POST REQUEST ON /cuurrency", ()=>{
  it("should return all currencies with status 200",async ()=>{
    const res = await request(app).get("/currencies")
    expect(res.status).toBe(200)
    expect(res.body).have
  })
})