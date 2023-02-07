import { Uploads } from '../../routes/uploads/uploads';
import prisma from '../../../lib/prisma';

export const getAllUploads = async (): Promise<Uploads> => prisma.upload.findMany();
