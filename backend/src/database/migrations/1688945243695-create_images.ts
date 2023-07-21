import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createImages1688945243695 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
          name: 'images',
          columns: [
            {
              name: 'id',
              type: 'integer',
              unsigned: true,
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'path',
              type: 'varchar',
            },
            {
              name: 'point_id',
              type: 'integer',
            }
          ],
          foreignKeys: [
            {
              name: 'ImagePoint',
              columnNames: ['point_id'],
              referencedColumnNames: ['id'],
              referencedTableName: 'points',
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
            }
          ]
        }))
      }
  
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('images');
      }
  

}
