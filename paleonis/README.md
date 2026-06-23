# PaLeonis — Infra 3-tiers (équipe NYJ)

Front (nginx) → API (Node/Express) → Base (MySQL), le tout sur un réseau Docker.

## Déploiement (à faire sur la VM Linux)

```bash
# 1. Se placer dans le dossier du projet
cd ~/paleonis        # ou le chemin de votre arborescence

# 2. Construire et lancer les 3 conteneurs
docker compose up -d --build

# 3. Vérifier qu'ils tournent
docker ps

# 4. Ouvrir l'appli dans le navigateur
#    http://<IP-de-la-VM>:8080
```

## Ports exposés sur la VM
- `8080` → front (nginx)
- `3000` → API (test direct : `curl http://localhost:3000/api/health`)
- la base MySQL n'est **pas** exposée (volontaire, bonne pratique)

## Tester la chaîne complète
```bash
# Lecture (front -> API -> base)
curl http://localhost:3000/api/messages

# Écriture
curl -X POST http://localhost:3000/api/messages \
     -H "Content-Type: application/json" \
     -d '{"contenu":"Test persistance NYJ"}'
```

## Prouver la persistance (volume)
```bash
# 1. Ajouter un message (via l'appli ou le curl POST ci-dessus)
# 2. Redémarrer les conteneurs
docker compose restart
# 3. Recharger la page : le message est toujours là
```

## Logs
```bash
docker compose logs api
docker compose logs db
```

## Réseau Docker
```bash
docker network inspect paleonis_paleonis-net
```
