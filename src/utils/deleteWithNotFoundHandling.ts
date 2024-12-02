import { NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const deleteWithNotFoundHandling = async <T>(
  deleteFunction: () => Promise<T>,
  entityName: string,
  id: number | string,
): Promise<T> => {
  try {
    return await deleteFunction();
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new NotFoundException(`${entityName} with ID ${id} not found`);
    }
    throw error;
  }
};
