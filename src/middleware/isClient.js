const isClient = (req, res, next) => {
  try {    
    console.log("Utilisateur décodé :", req.user); 
    if (!req.user || req.user.role !== 'client') {
      return res.status(403).json({ message: 'Accès refusé. Vous devez être un client.' });
    }
    next();
  } catch (error) {
    console.log("Erreur lors de la vérification du rôle :", error); 
    res.status(500).json({ message: 'Erreur serveur lors de la vérification du token.', error });
  }
};

module.exports = isClient;
