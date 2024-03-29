import { Injectable } from '@nestjs/common';

/**
 * Service responsible for providing the welcome message for the application.
 * @remarks
 * This service provides functionality to retrieve the welcome message for the application.
 * @public
 */
@Injectable()
export class AppService {
  /**
   * Retrieves the welcome message for the application.
   * @returns {string} The welcome message.
   */
  getWelcomeMessage(): string {
    /**
     * Returns the welcome message.
     */
    return 'Hello welcome to Miliano-eWallet API!';
  }
}
