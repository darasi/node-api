/**
 * Create users table.
 *
 * @param  {object} knex
 * @return {Promise}
 */
export function up(knex) {
  return knex.schema.createTable('users', table => {
    table.increments().primary();
    table.string('name').notNull();
    table.string('first_name').nullable();
    table.string('last_name').nullable();
    table.string('email').nullable().unique();
    table.string('password').notNull();
    table.string('provider').nullable();
    table.string('fb_id').nullable();
    table.string('google_id').nullable();
    table.string('photo_url').nullable();

    table
      .timestamp('created_at')
      .notNull()
      .defaultTo(knex.raw('now()'));
    table.timestamp('updated_at').nullable();
  });
}

/**
 * Drop users table.
 *
 * @param  {object} knex
 * @return {Promise}
 */
export function down(knex) {
  return knex.schema.dropTable('users');
}
