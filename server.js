const app = require('./src/app');  
const dontenv = require('dotenv');
const PORT = process.env.PORT || 5000;

dontenv.config();

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});