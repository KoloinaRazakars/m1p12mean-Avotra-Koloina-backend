const isManager = (req, res, next) => {
  try {    
    if (decoded.role !== 'manager') {
      return res.status(403).json({ message: 'Accès refusé. Vous devez être un manager.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur lors de la vérification du token.', error });
  }
};

module.exports = isManager;
