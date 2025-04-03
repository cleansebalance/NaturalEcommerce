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
  // Check if Supabase is properly configured and initialized
  try {
    log("Checking database connection...", "supabase");
    
    // First verify Supabase API connectivity
    const supabaseConnected = await verifySupabaseConnection();
    
    if (!supabaseConnected) {
      log("Could not connect to Supabase API, checking direct PostgreSQL connection...", "supabase");
    }
    
    // Check database structure regardless of Supabase API connection
    // This will help us understand if we have table structure issues or just API access issues
    const client = await pool.connect();
    try {
      // Check if tables exist in the PostgreSQL database
      const tableCheck = await client.query(`
        SELECT COUNT(*) AS table_count 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('categories', 'products', 'testimonials', 'users', 'cart_items')
      `);
      
      const tableCount = parseInt(tableCheck.rows[0].table_count);
      const expectedTableCount = 5; // categories, products, testimonials, users, cart_items
      
      if (tableCount === expectedTableCount) {
        log(`Database structure verified (${tableCount}/${expectedTableCount} tables exist)`, "supabase");
        
        // If all tables exist but Supabase API doesn't work, attempt to repair Supabase access
        if (!supabaseConnected) {
          log("Tables exist but Supabase API can't access them, attempting to fix...", "supabase");
          
          // Attempt to refresh Supabase schema cache
          try {
            await client.query(`SELECT pg_notify('pgrst', 'reload schema')`);
            log("Supabase schema cache refresh requested", "supabase");
            
            // Re-check Supabase connection after refresh attempt
            const refreshedConnection = await verifySupabaseConnection();
            if (refreshedConnection) {
              log("Supabase connectivity restored after schema refresh", "supabase");
            } else {
              log("Supabase connectivity still failing after schema refresh", "supabase");
            }
          } catch (refreshError) {
            log(`Error attempting to refresh schema: ${refreshError}`, "supabase");
          }
        }
        
        // Initialize Supabase storage and set it as the storage provider
        // The storage implementation will handle Supabase API fallbacks internally
        log("Initializing Supabase storage...", "supabase");
        await supabaseStorage.initialize();
        setStorage(supabaseStorage);
        log("Switched to Supabase storage successfully", "supabase");
      } else {
        // Missing some tables, attempt migration
        log(`Database structure incomplete (${tableCount}/${expectedTableCount} tables found), attempting migration...`, "supabase");
        
        // Check if we have partial tables and need to clean up
        if (tableCount > 0) {
          log("Partial table structure detected, dropping existing tables for clean migration...", "supabase");
          try {
            // Drop existing tables to ensure clean slate
            await client.query(`
              DO $$
              DECLARE
                t text;
              BEGIN
                FOR t IN SELECT tablename FROM pg_tables 
                WHERE schemaname = 'public' AND 
                tablename IN ('categories', 'products', 'reviews', 'testimonials', 'orders', 'users', 'cart_items')
                LOOP
                  EXECUTE format('DROP TABLE IF EXISTS %I CASCADE', t);
                END LOOP;
              END
              $$;
            `);
            log("Existing tables dropped successfully", "supabase");
          } catch (dropError) {
            log(`Error dropping existing tables: ${dropError}`, "supabase");
          }
        }
        
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
    } finally {
      client.release();
    }
  } catch (error) {
    log(`Database connection error: ${error}`, "supabase");
    
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
  
  // Helper function to verify Supabase API connectivity
  async function verifySupabaseConnection(): Promise<boolean> {
    try {
      // Try to access the system schema via Supabase, which should work regardless of our app tables
      const { error } = await supabase.from('pg_tables').select('schemaname').limit(1);
      
      if (error) {
        log(`Supabase API connection test failed: ${error.message}`, "supabase");
        return false;
      }
      
      // Check for application-specific tables
      const tables = ['categories', 'products', 'testimonials'];
      let allTablesAccessible = true;
      
      for (const table of tables) {
        const { error: tableError } = await supabase.from(table).select('id').limit(1);
        
        if (tableError) {
          log(`Supabase can't access table '${table}': ${tableError.message}`, "supabase");
          allTablesAccessible = false;
          break;
        }
      }
      
      if (allTablesAccessible) {
        log("Supabase API connection verified with all application tables accessible", "supabase");
      } else {
        log("Supabase API connected but application tables are not accessible", "supabase");
      }
      
      return allTablesAccessible;
    } catch (error) {
      log(`Error verifying Supabase connection: ${error}`, "supabase");
      return false;
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
