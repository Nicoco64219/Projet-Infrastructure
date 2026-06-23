-- ============================================================
--  PaLeonis - Initialisation de la base
--  Joué automatiquement par MySQL au PREMIER démarrage du conteneur
-- ============================================================

CREATE TABLE IF NOT EXISTS messages (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  contenu   VARCHAR(255) NOT NULL,
  cree_le   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deux lignes de départ pour prouver tout de suite la chaîne front -> API -> base
INSERT INTO messages (contenu) VALUES
  ('Premier message stocke dans la base PaLeonis'),
  ('Si ce texte vient de la base, alors le front a interroge l API qui a lu MySQL');
