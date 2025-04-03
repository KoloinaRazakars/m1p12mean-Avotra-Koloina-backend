const isMecanicien = (req, res, next) => {
  try {    

    if (!req.user || req.user.role !== 'mecanicien') {
      return res.status(403).json({ message: 'Accès refusé. Vous devez être un mecanicien.' });
    }
    next();
  } catch (error) {
    console.log("Erreur lors de la vérification du rôle :", error); 
    res.status(500).json({ message: 'Erreur serveur lors de la vérification du token.', error });
  }
};

module.exports = isMecanicien;
