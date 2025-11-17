import path from 'path';
import { accessSync, constants } from 'fs';
import { NotFoundException } from '@nestjs/common';

export enum Role {
  EX_M = 'EX_M',
  QM = 'QM',
  LOP = 'LOP',
  QOP = 'QOP',
  Admin = 'A',
}

export function getMimeType(filePath) {
  try {
    accessSync(filePath, constants.F_OK);
  } catch (err) {
    throw new NotFoundException('no file');
  }

  const ext = path.extname(filePath).toLowerCase();

  // Simple mapping of file extensions to MIME types
  const mimeTypes = {
    '.txt': 'text/plain',
    '.html': 'text/html',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    // Add more mappings as needed
  };

  // Default to 'application/octet-stream' if the extension is not recognized
  return mimeTypes[ext] || 'application/octet-stream';
}

export type AuthPayLoad = {
  sub: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  type: 'access' | 'refresh';
};
