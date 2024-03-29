import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserWalletTransactionTables1711705106069
  implements MigrationInterface
{
  name = 'CreateUserWalletTransactionTables1711705106069';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."user_role_enum" AS ENUM('customer', 'admin', 'superadmin')
        `);
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "phoneNumber" character varying NOT NULL,
                "password" character varying NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                "role" "public"."user_role_enum" NOT NULL DEFAULT 'customer',
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."transaction_type_enum" AS ENUM('top-up', 'withdrawal', 'transfer')
        `);
    await queryRunner.query(`
            CREATE TABLE "transaction" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "type" "public"."transaction_type_enum" NOT NULL,
                "amount" numeric(10, 2) NOT NULL,
                "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
                "sourceWalletId" integer,
                "targetWalletId" integer,
                CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "wallet" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "balance" numeric(10, 2) NOT NULL DEFAULT '0',
                "currency" character varying(3) NOT NULL DEFAULT 'USD',
                "userId" integer,
                CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction"
            ADD CONSTRAINT "FK_4dbaac33d5403f462da6cdeaac6" FOREIGN KEY ("sourceWalletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction"
            ADD CONSTRAINT "FK_eb565667cec073531d09652c72f" FOREIGN KEY ("targetWalletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "wallet"
            ADD CONSTRAINT "FK_35472b1fe48b6330cd349709564" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "wallet" DROP CONSTRAINT "FK_35472b1fe48b6330cd349709564"
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction" DROP CONSTRAINT "FK_eb565667cec073531d09652c72f"
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction" DROP CONSTRAINT "FK_4dbaac33d5403f462da6cdeaac6"
        `);
    await queryRunner.query(`
            DROP TABLE "wallet"
        `);
    await queryRunner.query(`
            DROP TABLE "transaction"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."transaction_type_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."user_role_enum"
        `);
  }
}
