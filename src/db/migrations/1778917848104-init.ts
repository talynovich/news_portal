import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1778917848104 implements MigrationInterface {
  name = 'Init1778917848104';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "comment" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" integer, "newsId" integer, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "news" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" integer, CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "username" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_725c4f36102e5e9599cfb2ce580" FOREIGN KEY ("newsId") REFERENCES "news"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "news" ADD CONSTRAINT "FK_18ab67e7662dbc5d45dc53a6e00" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "news" DROP CONSTRAINT "FK_18ab67e7662dbc5d45dc53a6e00"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_725c4f36102e5e9599cfb2ce580"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_276779da446413a0d79598d4fbd"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "news"`);
    await queryRunner.query(`DROP TABLE "comment"`);
  }
}
