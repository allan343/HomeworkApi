const SchoolClassService = {
  getAllSchoolClasses(knex) {
    return knex.select('*').from('school_classes')
  },
  insertSchoolClass(knex, newSchoolClass) {
    return knex
      .insert(newSchoolClass)
      .into('school_classes')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, id) {
    return knex.from('school_classes').select('*').where('id', id).first()
  },
  deleteSchoolClass(knex, id) {
    return knex('school_classes')
      .where({ id })
      .delete()
  },
  updateSchoolClass(knex, id, newSchoolClass) {
    return knex('school_classes')
      .where({ id })
      .update(newSchoolClass)
  },
}

module.exports = SchoolClassService;