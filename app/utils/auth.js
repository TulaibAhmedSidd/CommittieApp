import jwt from 'jsonwebtoken';

const getBearerToken = (req) => {
  const header = req.headers.get("Authorization") || req.headers.get("authorization");

  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  return header.split(" ")[1];
};

const verifyToken = (req) => {
  const token = getBearerToken(req);

  if (!token) {
    return { authorized: false, message: "No token, authorization denied", status: 401 };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { authorized: true, user: decoded };
  } catch (err) {
    return { authorized: false, message: "Invalid token", status: 401 };
  }
};

export const verifyAdmin = (req) => {
  const auth = verifyToken(req);

  if (!auth.authorized) {
    return auth;
  }

  if (!auth.user?.isAdmin) {
    return { authorized: false, message: "Not authorized as an admin", status: 403 };
  }

  return auth;
};

export const verifyMember = (req) => {
  const auth = verifyToken(req);

  if (!auth.authorized) {
    return auth;
  }

  if (!auth.user?.userId || auth.user?.isAdmin) {
    return { authorized: false, message: "Not authorized as a member", status: 403 };
  }

  return auth;
};

export const verifyAuthenticatedUser = (req) => verifyToken(req);

export const unauthorizedResponse = (authResult) =>
  new Response(JSON.stringify({ message: authResult.message }), {
    status: authResult.status || 401,
    headers: { "Content-Type": "application/json" },
  });
