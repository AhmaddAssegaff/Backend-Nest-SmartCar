import { NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const updateWithNotFoundHandling = async <T>(
  updateFunction: () => Promise<T>,
  entityName: string,
  id: number | string,
): Promise<T> => {
  try {
    return await updateFunction();
  } catch (error) {
    console.error('Error during update:', error);
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new NotFoundException(`${entityName} with ID ${id} not found`);
    }
    throw error;
  }
};
