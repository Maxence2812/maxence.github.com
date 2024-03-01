// Intégration de Cloudflare avec JavaScript
// Active le mode "Under Attack" pour une protection renforcée
fetch('https://api.cloudflare.com/client/v4/user/firewall/analogs', {
  method: 'PATCH',
  headers: {
    'X-Auth-Email': 'tissot.maxence2812@gmail.com',
    'X-Auth-Key': 'b8fd00f9bce6e3f487385f24e7e5bd2a797bd',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    mode: 'under_attack',
  }),
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Erreur:', error));
// Limite le nombre de requêtes par IP
const ipAddresses = {}; // Utilise une structure de données appropriée pour stocker les adresses IP
const maxRequestsPerMinute = 100;

function handleRequest(request) {
  const clientIP = request.ip;
  
  if (!ipAddresses[clientIP]) {
    ipAddresses[clientIP] = {
      requests: 1,
      lastRequestTime: Date.now(),
    };
  } else {
    const currentTime = Date.now();
    const elapsedTime = currentTime - ipAddresses[clientIP].lastRequestTime;
    
    if (elapsedTime < 60000) { // 60 000 ms = 1 minute
      ipAddresses[clientIP].requests++;
      ipAddresses[clientIP].lastRequestTime = currentTime;
      
      if (ipAddresses[clientIP].requests > maxRequestsPerMinute) {
        // Bloquer ou limiter les requêtes supplémentaires de cette adresse IP
        // Exemple : renvoyer une erreur 429 (Trop de requêtes)
        return new Response('Trop de requêtes', { status: 429 });
      }
    } else {
      // Réinitialiser le compteur de requêtes pour cette adresse IP
      ipAddresses[clientIP].requests = 1;
      ipAddresses[clientIP].lastRequestTime = currentTime;
    }
  }

  // Traiter la requête normalement
  // ...
}
