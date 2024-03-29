import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTransactionsTable1711729336883 implements MigrationInterface {
  name = 'AlterTransactionsTable1711729336883';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "transaction" DROP CONSTRAINT "FK_4dbaac33d5403f462da6cdeaac6"
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction" DROP CONSTRAINT "FK_eb565667cec073531d09652c72f"
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction" DROP COLUMN "sourceWalletId"
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction" DROP COLUMN "targetWalletId"
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction"
            ADD "walletId" integer
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."transaction_type_enum"
            RENAME TO "transaction_type_enum_old"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."transaction_type_enum" AS ENUM('Debit', 'Credit')
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction"
            ALTER COLUMN "type" TYPE "public"."transaction_type_enum" USING "type"::"text"::"public"."transaction_type_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."transaction_type_enum_old"
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction"
            ADD CONSTRAINT "FK_900eb6b5efaecf57343e4c0e79d" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "transaction" DROP CONSTRAINT "FK_900eb6b5efaecf57343e4c0e79d"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."transaction_type_enum_old" AS ENUM('top-up', 'withdrawal', 'transfer')
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction"
            ALTER COLUMN "type" TYPE "public"."transaction_type_enum_old" USING "type"::"text"::"public"."transaction_type_enum_old"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."transaction_type_enum"
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."transaction_type_enum_old"
            RENAME TO "transaction_type_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction" DROP COLUMN "walletId"
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction"
            ADD "targetWalletId" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction"
            ADD "sourceWalletId" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction"
            ADD CONSTRAINT "FK_eb565667cec073531d09652c72f" FOREIGN KEY ("targetWalletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction"
            ADD CONSTRAINT "FK_4dbaac33d5403f462da6cdeaac6" FOREIGN KEY ("sourceWalletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
