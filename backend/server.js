import app from "./app.js";
import connectDb from "./config/db.js";

app.listen(process.env.PORT, async () => {
  try {
    await connectDb();
    console.log(
      `server is running on port ${process.env.PORT}\n http://localhost:${process.env.PORT}`
    );
  } catch (err) {
    console.error(`error: ${err}`);
    process.exit(1);
  }
});
