import { app } from "./app.js";
import connectDB from "./db/connect.DB.js";
import { PORT } from "./utils/constants.js";

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(` ⚙️  Server is running at port : ${PORT}`);
    });
  } catch (err) {
    console.log("connection failed !!!", err);
  }
};

startServer();
