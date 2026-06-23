// Le front appelle l'API via le MEME hote que la page (/api/...).
// C'est nginx qui transmet ensuite la requete au conteneur "api".

async function verifierSante() {
  const span = document.getElementById("statut");
  try {
    const r = await fetch("/api/health");
    const data = await r.json();
    span.textContent = "en ligne (" + data.service + ")";
    span.className = "statut ok";
  } catch (e) {
    span.textContent = "injoignable";
    span.className = "statut ko";
  }
}

async function chargerMessages() {
  const ul = document.getElementById("liste");
  try {
    const r = await fetch("/api/messages");
    const messages = await r.json();
    ul.innerHTML = "";
    if (messages.length === 0) {
      ul.innerHTML = "<li>Aucun message pour l'instant.</li>";
      return;
    }
    for (const m of messages) {
      const li = document.createElement("li");
      li.textContent = m.contenu;
      const small = document.createElement("small");
      small.textContent = "id " + m.id + " — " + m.cree_le;
      li.appendChild(small);
      ul.appendChild(li);
    }
  } catch (e) {
    ul.innerHTML = "<li>Erreur de chargement depuis l'API.</li>";
  }
}

async function envoyerMessage() {
  const champ = document.getElementById("champ");
  const contenu = champ.value.trim();
  if (!contenu) return;
  await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contenu }),
  });
  champ.value = "";
  chargerMessages();
}

document.getElementById("envoyer").addEventListener("click", envoyerMessage);
document.getElementById("champ").addEventListener("keydown", (e) => {
  if (e.key === "Enter") envoyerMessage();
});

verifierSante();
chargerMessages();
