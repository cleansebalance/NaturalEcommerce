import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { migrateToSupabase } from "./setupSupabase";
import { storage, setStorage } from "./storage";
import { supabase } from "./supabase";
import { supabaseStorage } from "./supabaseStorage";

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
  // Check if Supabase is properly configured and initialized
  try {
    log("Checking Supabase connection...", "supabase");
    const { data, error } = await supabase.from('categories').select('*').limit(1);
    
    if (data && data.length > 0) {
      log("Supabase tables detected, using Supabase storage", "supabase");
      
      // Initialize Supabase storage and set it as the storage provider
      await supabaseStorage.initialize();
      setStorage(supabaseStorage);
      log("Switched to Supabase storage successfully", "supabase");
    } else {
      log("No Supabase tables detected, attempting migration...", "supabase");
      
      // Attempt to run the migration
      const migrationSuccess = await migrateToSupabase();
      
      if (migrationSuccess) {
        log("Migration completed successfully, using Supabase storage", "supabase");
        await supabaseStorage.initialize();
        setStorage(supabaseStorage);
      } else {
        log("Migration failed, falling back to in-memory storage", "supabase");
      }
    }
  } catch (error) {
    log(`Supabase connection error: ${error}`, "supabase");
    
    // Attempt migration as a fallback
    log("Attempting database migration as fallback...", "supabase");
    const migrationSuccess = await migrateToSupabase();
    
    if (migrationSuccess) {
      log("Fallback migration completed successfully, using Supabase storage", "supabase");
      await supabaseStorage.initialize();
      setStorage(supabaseStorage);
    } else {
      log("Fallback migration failed, using in-memory storage", "supabase");
    }
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
