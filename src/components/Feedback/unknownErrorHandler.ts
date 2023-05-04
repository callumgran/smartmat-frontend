import { ApiError as BackendApiError } from '@/api';
import { AxiosError } from 'axios';

export type ResponseError = {
  message: string;
  statusCode: number;
};

/**
 * Finds the correct error message for the given error
 * The message is then put into the error store
 * which an error component can then display
 * @param error The unknown error to handle
 */
export const handleUnknownError = (error: any): ResponseError | null => {
  console.error(error);
  let msg = 'Det oppsto en feil med behandling av forespørselen din.';
  let statusCode: number = 500;
  if (error instanceof AxiosError) {
    statusCode = error.response?.status ?? 500;
    switch (error.code) {
      case AxiosError.ERR_NETWORK:
        msg =
          'Det oppsto en nettverksfeil. Vennligst sjekk nettverksforbindelsen din og prøv igjen.';
      case AxiosError.ERR_BAD_REQUEST:
        msg = 'Det oppsto en feil med behandling av forespørselen din.';
      case AxiosError.ERR_CANCELED:
        msg = 'Forespørselen ble avbrutt.';
      case AxiosError.ETIMEDOUT:
        msg = 'Forespørselen tok for lang tid. Vennligst prøv igjen.';
      default:
        msg = 'Vi klarte ikke å videreføre din forespørsel riktig';
    }
  } else if (error instanceof BackendApiError) {
    msg = error.body?.detail ?? error.body;
    statusCode = error.status;
  } else if (error instanceof Error && error.message.includes('classList')) {
    return null;
  }

  return { message: msg, statusCode: statusCode };
};

//export default handleUnknownError;
//export default ResponseError;
