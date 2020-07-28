const HomeworkService = require('../src/homework/HomeworkService');
const knex = require('knex');

describe(`Homework Service object`, function () {
  let db;
  let testItems = [
    {
      homeworkid: 1,
      classid: 1,
      homeworkdescription: "math homework",
      schoolclass: "math",
      homeworktype: "Homework",
      duedate: "07-27-2020",
      duetime: "2:00pm",
      homeworkpriority: "Medium"
    },
    {
      homeworkid: 2,
      classid: 2,
      homeworkdescription: "physics homework",
      schoolclass: "physics",
      homeworktype: "Homework",
      duedate: "07-27-2020",
      duetime: "10:00am",
      homeworkpriority: "Medium"
    },

  ]

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
  })

  before(() => db('homework_list').truncate());

  afterEach(() => db('homework_list').truncate());

  after(() => db.destroy());

  context(`Given 'homework' has data`, () => {
    beforeEach(() => {
      return db
        .into('homework_list')
        .insert(testItems);
    })

    it(`getAllItems() resolves all items from 'homework' table`, () => {

      return HomeworkService.getAllHomework(db)
        .then(actual => {
          expect(actual).to.eql(testItems);
        })
    })

    it(`getById() resolves a homework by id from 'homework' table`, () => {
      const idToGet = 2;
      const secondItem = testItems[idToGet - 1];
      return HomeworkService.getById(db, idToGet)
        .then(actual => {
          expect(actual).to.eql(
            secondItem
          );
        })
    })

    it(`deleteItem() removes an homework by id from 'homework' table`, () => {
      const homeworkId = 1;
      return HomeworkService.deleteHomework(db, showId)
        .then(() => HomeworkService.getAllHomework(db))
        .then(allItems => {
          // copy the test items array without the removed item
          const expected = testItems
            .filter(homework => homework.homeworkid !== homeworkId);
          expect(allItems).to.eql(expected);
        })
    })

    it(`updateItem() updates an homework from the 'homework' table`, () => {
      const idOfItemToUpdate = 1;
      const newItemData = {
        homeworkdescription: 'physics lab',
      };
      const originalItem = testItems[idOfItemToUpdate - 1];
      return HomeworkService.updateHomework(db, idOfItemToUpdate, newItemData)
        .then(() => HomeworkService.getById(db, idOfItemToUpdate))
        .then(homework => {
          expect(homework).to.eql({
            homeworkid: idOfItemToUpdate,
            ...originalItem,
            ...newItemData,
          });
        })
    })
  })

  context(`Given 'homework' has no data`, () => {
    it(`getAllItems() resolves an empty array`, () => {
      return HomeworkService.getAllHomework(db)
        .then(actual => {
          expect(actual).to.eql([]);
        })
    })

    it(`insertItem() inserts a homework and resolves the homework with an 'id'`, () => {
      const newItem =  {
        homeworkid: 3,
        classid: 2,
        homeworkdescription: "physics lab",
        schoolclass: "physics",
        homeworktype: "Homework",
        duedate: "07-27-2020",
        duetime: "10:00am",
        homeworkpriority: "Medium"
      };
      return HomeworkService.insertHomework(db, newItem)
        .then(actual => {
          expect(actual).to.eql({
            homeworkid: 1,
            ...newItem
          });
        })
    })
  })
})