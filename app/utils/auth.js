import jwt from 'jsonwebtoken';

export const verifyAdmin = (req) => {
  const token = req.headers.get("Authorization")?.split(" ")[1];  // Get token from Authorization header

  if (!token) {
    return { authorized: false, message: "No token, authorization denied" };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return { authorized: false, message: "Not authorized as an admin" };
    }
    req.user = decoded;  // Attach user info to the request object
    return { authorized: true };
  } catch (err) {
    return { authorized: false, message: "Invalid token" };
  }
};

export const verifyMember = (req) => {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return { authorized: false, message: "No token, authorization denied" };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId) { // Assuming member token has userId
      return { authorized: false, message: "Not authorized as a member" };
    }
    req.user = decoded;
    return { authorized: true };
  } catch (err) {
    return { authorized: false, message: "Invalid token" };
  }
};
