const express = require("express");
const app = express();
require("dotenv").config();
const { verifyToken } = require("./middleware/authHeaders");
// const routes = require("./api/routes");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;
const cors = require("cors");

const userRoutes = require("./api/auth/user.routes");
const categoryRoutes = require("./api/category/category.routes");
const expRoutes = require("./api/expense/exp.routes");
const budgetRoutes = require("./api/budget/budget.routes");

// Middleware configurations
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB
connectDB();


app.use(cors({
  origin: "*",
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
}));


app.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).send({
    body: req.body,
    message: "Instance is healthy",
  });
});



app.use(verifyToken);


// app.use("/api", routes);
app.use("/api/expense", expRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/auth", userRoutes);


// Start
app.listen(port, () => {
  console.log("Server running on port :" + port);
});
