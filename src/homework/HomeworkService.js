const HomeworkService = {
  getAllHomework(knex) {
    return knex.select('*').from('homework_list');
  },
  insertHomework(knex, newHomework) {
    return knex
      .insert(newHomework)
      .into('homework_list')
      .returning('*')
      .then(rows => {
        return rows[0];
      })
  },
  getById(knex, homeworkid) {
    return knex.from('homework_list').select('*').where('homeworkid', homeworkid).first();
  },
  deleteHomework(knex, homeworkid) {
    return knex('homework_list')
      .where({ homeworkid })
      .delete();
  },
  updateHomework(knex, homeworkid, newHomework) {
    return knex('homework_list')
      .where({ homeworkid })
      .update(newHomework);
  },
}

module.exports = HomeworkService