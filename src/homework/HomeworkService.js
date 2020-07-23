const HomeworkService = {
  getAllHomework(knex) {
    return knex.select('*').from('homework_list')
  },
  insertHomework(knex, newHomework) {
    return knex
      .insert(newHomework)
      .into('homework_list')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, id) {
    return knex.from('homework_list').select('*').where('id', id).first()
  },
  deleteHomework(knex, id) {
    return knex('homework_list')
      .where({ id })
      .delete()
  },
  updateHomework(knex, id, newHomework) {
    return knex('homework_list')
      .where({ id })
      .update(newHomework)
  },
}

module.exports = HomeworkService