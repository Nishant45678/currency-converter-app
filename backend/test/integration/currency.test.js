import { describe, expect, it} from "vitest"
import app from "../../app.js"
import request from "supertest"


describe("GET /currencies", ()=>{
  it("should return all currencies with status 200",async ()=>{
    const res = await request(app).get("/api/currencies")
    expect(res.status).toBe(200)
  })
})

describe("POST /convert",()=>{
  const data = {
  from:"USD",
  to:"INR",
  amount:1
}
  it("should return status code 200",async()=>{
    const res = await request(app).post("/api/convert").send(data)
    expect(res.status).toBe(200)
    console.log(res.body)
  })
})