import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1624138260839 implements MigrationInterface {
    name = 'migration1624138260839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "book" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "category" character varying array NOT NULL, "author" character varying NOT NULL, "cover" character varying NOT NULL, "pub_date" date NOT NULL, CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "book"`);
    }

}
