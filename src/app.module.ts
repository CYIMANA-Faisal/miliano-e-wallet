import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './common/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { WalletsModule } from './wallets/wallets.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UserSeedService } from './seeds/user.seed.service';
import { BcryptService } from './common/services/bcrypt.service';

/**
 * The root module of the NestJS application.
 * @remarks
 * This module orchestrates the integration of other modules, controllers, and providers.
 * @public
 */
@Module({
  imports: [
    /**
     * Registers the configuration module for the application.
     */
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    /**
     * Registers the TypeORM module for database integration.
     */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      /**
       * Retrieves database configuration asynchronously using the provided `ConfigService`.
       * @param {ConfigService} configService - The configuration service.
       * @returns The database configuration.
       */
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
      inject: [ConfigService],
    }),
    /**
     * Registers the users module for user-related functionalities.
     */
    UsersModule,
    /**
     * Registers the authentication module for authentication functionalities.
     */
    AuthModule,
    WalletsModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [
    /**
     * Registers the HTTP exception filter to handle HTTP exceptions.
     */
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    /**
     * Registers the database exception filter to handle database exceptions.
     */
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter,
    },
    /**
     * Registers the response transform interceptor to transform HTTP responses.
     */
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
    /**
     * Registers the timeout interceptor to handle request timeouts.
     */
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    /**
     * Registers the audit interceptor to perform audit logging.
     */
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
    /**
     * Registers the application service.
     */
    AppService,
    BcryptService,
    UserSeedService,
  ],
})
export class AppModule {
  constructor(private readonly userSeedService: UserSeedService) {}

  async onApplicationBootstrap() {
    await this.userSeedService.createSuperAdminUser();
    await this.userSeedService.createHelpSupportUser();
  }
}
