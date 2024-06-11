import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import UserRoute from "./routes/UserRoute.js";

const app = express();
mongoose.connect(
  "mongodb://127.0.0.1:27017/hutangApp",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("database terkoneksi weeeekkk.."));

app.use(cors());
app.use(express.json());
app.use(UserRoute);

app.listen(5001, () => console.log("server berjalann jiaaa"));

// const loginScema = new mongoose.Schema({
//   username:{type:String,require:true},
//   password:{type:String,require:true}
// });

// const collection = mongoose.model("collection", loginScema);
// module.exports = collection