import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Proxy for Hypixel Bazaar API
  app.get("/api/bazaar", async (req, res) => {
    try {
      const response = await axios.get("https://api.hypixel.net/v2/skyblock/bazaar");
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Bazaar data" });
    }
  });

  // Proxy for UUID lookup
  app.get("/api/uuid/:username", async (req, res) => {
    try {
      const response = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${req.params.username}`);
      res.json(response.data);
    } catch (error) {
      res.status(404).json({ error: "User not found" });
    }
  });

  // Proxy for Player Collections
  app.get("/api/player/:uuid/collections", async (req, res) => {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) return res.status(400).json({ error: "API Key required" });

    try {
      const response = await axios.get(`https://api.hypixel.net/v2/skyblock/profiles?uuid=${req.params.uuid}`, {
        headers: { "API-Key": apiKey as string }
      });
      
      const profiles = response.data.profiles;
      if (!profiles || profiles.length === 0) return res.json({ collections: {} });
      
      const activeProfile = profiles.find((p: any) => p.selected) || profiles[0];
      const collections = activeProfile.members[req.params.uuid]?.collection || {};
      
      res.json({ collections });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch player data" });
    }
  });

  // Proxy for Historical Bazaar Data (using Coflnet API)
  app.get("/api/bazaar/:itemId/history", async (req, res) => {
    const { itemId } = req.params;
    try {
      console.log(`[Server] Fetching history for: ${itemId}`);
      
      // Try Coflnet Bazaar History
      try {
        const response = await axios.get(`https://sky.coflnet.com/api/bazaar/${itemId}/history`, {
          timeout: 8000,
          validateStatus: (status) => status < 500 // Don't throw on 404
        });
        
        if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
          console.log(`[Server] Success (Bazaar API): Found ${response.data.length} records for ${itemId}`);
          return res.json(response.data);
        }
      } catch (e: any) {
        console.warn(`[Server] Bazaar API failed for ${itemId}: ${e.message}`);
      }

      console.warn(`[Server] Trying fallback Item API for ${itemId}...`);
      
      // Fallback: Try a different Coflnet endpoint
      try {
        const fallbackResponse = await axios.get(`https://sky.coflnet.com/api/item/${itemId}/history`, {
          timeout: 8000,
          validateStatus: (status) => status < 500
        });

        if (fallbackResponse.status === 200 && Array.isArray(fallbackResponse.data)) {
          console.log(`[Server] Success (Item API): Found ${fallbackResponse.data.length} records for ${itemId}`);
          return res.json(fallbackResponse.data);
        }
      } catch (e: any) {
        console.warn(`[Server] Item API failed for ${itemId}: ${e.message}`);
      }
      
      // If both fail or return 404, return empty array instead of error
      res.json([]);
    } catch (error: any) {
      console.error(`[Server] Critical history fetch error for ${itemId}:`, error.message);
      res.json([]); // Always return array to prevent frontend crash
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
