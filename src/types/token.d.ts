import jwt from 'jsonwebtoken';

export interface Token extends jwt.JwtPayload {
  idCompany: string;
  idShop: string;
  role: string;
}
