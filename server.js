const app = require('./src/app');  

const PORT = process.env.PORT || 5000;  // Définir le port, ou utiliser celui défini dans .env

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});