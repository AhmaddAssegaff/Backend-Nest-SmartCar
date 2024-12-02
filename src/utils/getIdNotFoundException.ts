import { NotFoundException } from '@nestjs/common';

export const getIdNotFoundException = <T>(data: T, entityName: string, id: number | string) => {
  if (!data) {
    throw new NotFoundException(`${entityName} with ID ${id} not found`);
  }
};
