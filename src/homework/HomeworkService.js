const HomeworkService = {
  getAllHomework(knex) {
    return knex.select('*').from('homework')
  },
  insertHomework(knex, newHomework) {
    return knex
      .insert(newHomework)
      .into('homework')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, id) {
    return knex.from('homework').select('*').where('id', id).first()
  },
  deleteHomework(knex, id) {
    return knex('homework')
      .where({ id })
      .delete()
  },
  updateHomework(knex, id, newHomework) {
    return knex('homework')
      .where({ id })
      .update(newHomework)
  },
}

module.exports = HomeworkService