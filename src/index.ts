import express, { Express, json, urlencoded } from "express";
import morgan from "morgan";
import router from "#router/index.js";
import globalErrorHandler from  "#middleware/globalErrorHandler.js";
import { bootstrapDependencies } from "#core/bootstrap.js";

const app: Express = express();

bootstrapDependencies();

app.use(morgan("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));

app.use("/api", router);

app.use(globalErrorHandler);

app.listen(process.env.PORT, () => {
  console.log(`[${process.env.SERVICE_NAME}] service up on PORT:${process.env.PORT}`);
});
