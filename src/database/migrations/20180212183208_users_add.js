export function up(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.string('fb_id').nullable();
  });
}

export function down(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('fb_id');
  });
}
