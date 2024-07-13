import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    // Adicione outras propriedades do usuário conforme necessário
  };
}
