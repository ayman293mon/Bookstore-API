const basicAuth = require('basic-auth');

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'password';

const authMiddleware = (req, res, next) => {
  const user = basicAuth(req);

  if (!user || user.name !== ADMIN_USER || user.pass !== ADMIN_PASS) {
    res.set('WWW-Authenticate', 'Basic realm="Library API"');
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  next();
};

module.exports = authMiddleware;
