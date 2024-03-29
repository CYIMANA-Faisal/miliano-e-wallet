import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from './common/interfaces/api-response.interface';

/**
 * Controller responsible for handling root API endpoints.
 * @remarks
 * This controller provides endpoints for root API calls.
 * @public
 */
@Controller()
export class AppController {
  /**
   * Creates an instance of AppController.
   * @param {AppService} appService - The application service.
   */
  constructor(private readonly appService: AppService) {}

  /**
   * Handles GET requests to the root endpoint.
   * @returns {ApiResponse<string>} A response containing the welcome message.
   */
  @Get()
  getWelcomeMessage(): ApiResponse<string> {
    /**
     * Retrieves the welcome message from the application service.
     */
    const results = this.appService.getWelcomeMessage();
    /**
     * Constructs and returns a response object with the welcome message.
     */
    return { message: 'Root API calls successfully', data: results };
  }
}
