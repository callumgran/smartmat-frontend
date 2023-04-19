import { ApiError as BackendApiError } from '@/api';
import { AxiosError } from 'axios';

/**
 * Finds the correct error message for the given error
 * The message is then put into the error store
 * which an error component can then display
 * @param error The unknown error to handle
 */
const handleUnknownError = (error: any): string => {
  if (error instanceof AxiosError) {
    switch (error.code) {
      case AxiosError.ERR_NETWORK:
        return 'Det oppsto en nettverksfeil. Vennligst sjekk nettverksforbindelsen din og prøv igjen.';
      case AxiosError.ERR_BAD_REQUEST:
        return 'Det oppsto en feil med behandling av forespørselen din.';
      case AxiosError.ERR_CANCELED:
        return 'Forespørselen ble avbrutt.';
      case AxiosError.ETIMEDOUT:
        return 'Forespørselen tok for lang tid. Vennligst prøv igjen.';
      default:
        return 'Vi klarte ikke å videreføre din forespørsel riktig';
    }
  } else if (error instanceof BackendApiError) {
    return error.body?.detail ?? error.body;
  }
  return 'Det oppsto en feil med behandling av forespørselen din.';
};

export default handleUnknownError;
