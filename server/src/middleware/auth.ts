import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config.js'

export interface UsuarioToken {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor'
}

declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioToken
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No autenticado' })
    return
  }

  try {
    const token = header.slice(7)
    req.usuario = jwt.verify(token, config.jwtSecret) as UsuarioToken
    next()
  } catch {
    res.status(401).json({ error: 'Sesión inválida o expirada' })
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.usuario) {
    res.status(401).json({ error: 'No autenticado' })
    return
  }
  if (req.usuario.role !== 'admin') {
    res.status(403).json({ error: 'Se requiere rol administrador' })
    return
  }
  next()
}
