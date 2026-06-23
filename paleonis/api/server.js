// ============================================================
//  PaLeonis - API (Node.js / Express)
//  Role : faire le pont entre le frontend et la base MySQL.
//  Le front N'ACCEDE JAMAIS directement a la base : il passe par ici.
// ============================================================

const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Configuration de connexion a la base.
// DB_HOST vaut "db" : c'est le NOM du service Docker, pas une IP.
// Docker resout ce nom vers l'IP du conteneur MySQL sur le reseau interne.
const dbConfig = {
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "paleonis",
  password: process.env.DB_PASSWORD || "paleonispwd",
  database: process.env.DB_NAME || "paleonis",
};

let pool;

// Petite boucle de retry : au demarrage, MySQL peut mettre quelques
// secondes a etre pret. On reessaie au lieu de planter tout de suite.
async function initDb() {
  for (let essai = 1; essai <= 15; essai++) {
    try {
      pool = await mysql.createPool(dbConfig);
      await pool.query("SELECT 1");
      console.log("[API] Connexion a la base MySQL etablie.");
      return;
    } catch (err) {
      console.log(`[API] Base pas encore prete (essai ${essai}/15) : ${err.code}`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw new Error("[API] Impossible de joindre la base apres plusieurs essais.");
}

// --- Endpoint de sante : sert a verifier vite que l'API repond ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "api-paleonis" });
});

// --- Lecture : le front affiche ces messages venus de la BASE ---
app.get("/api/messages", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, contenu, cree_le FROM messages ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("[API] Erreur lecture :", err.message);
    res.status(500).json({ erreur: "Lecture impossible" });
  }
});

// --- Ecriture : prouve que l'API ecrit aussi dans la base ---
app.post("/api/messages", async (req, res) => {
  const contenu = (req.body && req.body.contenu) || "";
  if (!contenu.trim()) {
    return res.status(400).json({ erreur: "Le champ 'contenu' est vide" });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO messages (contenu) VALUES (?)",
      [contenu]
    );
    res.status(201).json({ id: result.insertId, contenu });
  } catch (err) {
    console.error("[API] Erreur ecriture :", err.message);
    res.status(500).json({ erreur: "Ecriture impossible" });
  }
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[API] En ecoute sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
