const isManager = (req, res, next) => {
  try {    
    console.log("Rôle utilisateur:", req.user.role);
    console.log("Middleware isManager appelé pour :", req.originalUrl);

    if (!req.user || req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Accès refusé. Vous devez être un manager.' });
    }
    next();
  } catch (error) {
    console.log("Erreur lors de la vérification du rôle :", error); 
    res.status(500).json({ message: 'Erreur serveur lors de la vérification du token.', error });
  }
};

module.exports = isManager;
