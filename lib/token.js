import jwt from "jsonwebtoken";

export const generateToken = (user) => jwt.sign(user, 'SECRET_KEY', {expiresIn: '8h'});
