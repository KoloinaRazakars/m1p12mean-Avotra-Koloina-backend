const isClient = (req, res, next) => {
    try {    
      if (decoded.role !== 'client') {
        return res.status(403).json({ message: 'Accès refusé. Vous devez être un client.' });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur lors de la vérification du token.', error });
    }
  };
  
  module.exports = isClient;
  