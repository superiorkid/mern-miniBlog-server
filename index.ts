import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8000;
app.listen(process.env.PORT, () => {
  console.log(`✨ App running on http://localhost:${process.env.PORT}/`);
});
