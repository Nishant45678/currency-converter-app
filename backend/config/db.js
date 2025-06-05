import { connect } from "mongoose";


const connectDb = async ()=>{
  try {
    await connect(process.env.MONGO_URI.trim());
    if(process.env.NODE_ENV.trim() == "development"){
      console.log("connectec to db")
    }
  } catch (error) {
    if(process.env.NODE_ENV.trim() == "development"){
      console.error(`Error: ${error}`)
    }
    process.exit(1)
  }
}

export default connectDb;