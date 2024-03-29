import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterWalletTableAddNameAttribute1711712167559
  implements MigrationInterface
{
  name = 'AlterWalletTableAddNameAttribute1711712167559';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "wallet"
            ADD "name" character varying(50) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "wallet"
            ALTER COLUMN "currency"
            SET DEFAULT 'RWF'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "wallet"
            ALTER COLUMN "currency"
            SET DEFAULT 'USD'
        `);
    await queryRunner.query(`
            ALTER TABLE "wallet" DROP COLUMN "name"
        `);
  }
}
