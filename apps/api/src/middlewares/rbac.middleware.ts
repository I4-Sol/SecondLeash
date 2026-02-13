import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { ForbiddenError, UnauthorizedError } from '@/shared/errors';

export const requireRole = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
};

export const requireShelterAccess = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new UnauthorizedError());
  }

  // SUPER_ADMIN can access all shelters
  if (req.user.role === Role.SUPER_ADMIN) {
    return next();
  }

  // Other roles must have a shelter assigned
  if (!req.user.shelterId) {
    return next(new ForbiddenError('No shelter assigned'));
  }

  next();
};

export const checkShelterOwnership = (shelterId: string | null) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    // SUPER_ADMIN can access all shelters
    if (req.user.role === Role.SUPER_ADMIN) {
      return next();
    }

    // Check if user's shelter matches the resource shelter
    if (req.user.shelterId !== shelterId) {
      return next(new ForbiddenError('Access denied to this shelter'));
    }

    next();
  };
};
