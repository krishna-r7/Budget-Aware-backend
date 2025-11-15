const jwt = require('jsonwebtoken');

const roleBasedRoutes = [

  { path: '/api/auth/refreshToken', roles: ['admin', 'franchise_owner', 'customer', 'delivery_boy'] },

];




exports.verifyToken = (req, res, next) => {
  const publicPaths = [

    '/api/auth/franchiseowner/signup',
    '/api/auth/franchiseowner/verifyotp',

  ];

  const dynamicPublicPaths = [

    '/api/product/getproductbycategory/',
    
  ];


  // Allow public routes
  if (publicPaths.includes(req.path) ||
    dynamicPublicPaths.some(path => req.path.startsWith(path))) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (authHeader) {

    // console.log(authHeader);
    const token = authHeader.split(' ')[1];

    // console.log(token);

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Store decoded token in req.user
      // console.log(req.user,'user')
      next();
    } catch (error) {
      return res.status(707).json({ message: 'Invalid or expired token', status_code: 707, data: null });
    }
  } else {
    return res.status(401).json({ message: 'Authorization header missing' });
  }
};




exports.authorizeRole = (req, res, next) => {
  // Find if the current route has a role restriction
  const routeConfig = roleBasedRoutes.find((route) => req.path.startsWith(route.path));

  // If the route requires role-based access
  if (routeConfig) {
    // Ensure req.user is set by verifyToken
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Check if the user's role is in the list of allowed roles
    if (!routeConfig.roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
  }

  next(); 
  
};