import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { migrateToSupabase } from "./setupSupabase";
import { storage, setStorage } from "./storage";
import { supabase } from "./supabase";
import { supabaseStorage } from "./supabaseStorage";
import { pool } from "./db";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Let's use the PostgreSQL database for storage
  log("Setting up PostgreSQL database storage", "storage");
  
  try {
    // Import the dbStorage after it's defined
    const { dbStorage } = await import("./dbStorage");
    
    // Test database connection
    log("Testing database connection...", "database");
    const client = await pool.connect();
    try {
      const testQuery = await client.query('SELECT NOW()');
      log(`Database connection successful: ${testQuery.rows[0].now}`, "database");
      
      // Initialize database with schema and seed data
      log("Initializing database...", "database");
      await dbStorage.initialize();
      
      // Use the database storage implementation
      setStorage(dbStorage);
      log("Now using PostgreSQL database for storage", "storage");
    } finally {
      client.release();
    }
  } catch (error) {
    log(`Database setup error: ${error}`, "database");
    log("Falling back to in-memory storage", "storage");
    
    // Import the memStorage from storage
    const { memStorage } = await import("./storage");
    setStorage(memStorage);
  }
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    log(`Server error: ${message}`, "error");
    res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
