import { isAxiosError } from 'axios';
import { z, ZodError } from 'zod';

/** Turns any thrown value into a message that explains what actually went wrong. */
export function describeError(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response) {
      const { message } = (error.response.data ?? {}) as { message?: string };
      return `O servidor respondeu ${error.response.status}${message ? `: ${message}` : ''}.`;
    }

    return `Sem resposta do servidor em ${error.config?.baseURL}. Verifique se o backend está rodando e se EXPO_PUBLIC_API_URL aponta para o IP da sua máquina.`;
  }

  if (error instanceof ZodError) {
    return `Resposta inesperada do servidor:\n${z.prettifyError(error)}`;
  }

  return error instanceof Error ? error.message : String(error);
}
