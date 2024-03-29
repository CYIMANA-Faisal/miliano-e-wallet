import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTransactionsTableColumnsAmount1711728369616
  implements MigrationInterface
{
  name = 'AlterTransactionsTableColumnsAmount1711728369616';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "transaction" DROP COLUMN "amount"
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction"
            ADD "amount" double precision NOT NULL DEFAULT '0'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "transaction" DROP COLUMN "amount"
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction"
            ADD "amount" numeric(10, 2) NOT NULL
        `);
  }
}
