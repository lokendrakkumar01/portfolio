import { Request } from 'express';

export const isUserAdminRequest = (req: Request): boolean => {
  if (!req.user || req.user.role !== 'admin') {
    return false;
  }
  return (
    req.query.adminView === 'true' ||
    req.query.published === 'all' ||
    req.headers['x-admin-view'] === 'true'
  );
};

