import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterWalletTableCulumnsBalance1711720305867
  implements MigrationInterface
{
  name = 'AlterWalletTableCulumnsBalance1711720305867';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "wallet" DROP COLUMN "balance"
        `);
    await queryRunner.query(`
            ALTER TABLE "wallet"
            ADD "balance" double precision NOT NULL DEFAULT '0'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "wallet" DROP COLUMN "balance"
        `);
    await queryRunner.query(`
            ALTER TABLE "wallet"
            ADD "balance" numeric(10, 2) NOT NULL DEFAULT '0'
        `);
  }
}
