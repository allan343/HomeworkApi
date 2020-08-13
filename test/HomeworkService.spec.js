const HomeworkService = require('../src/homework/HomeworkService');
const knex = require('knex');

describe(`Homework Service object`, function () {
  let db;

  let testItems = [
    {
      id: 1,
      classname: "Math",
      finishdate: new Date("2011/11/23"),
      startdate: new Date("2011/07/03"),
      building: "mcld",
      room: "201",
      teacher: "Vidas",
      starttime: "1:00pm",
      endtime: "2:00pm",
      sun: false,
      mon: false,
      tue: false,
      wed: false,
      thurs: false,
      fri: false,
      sat: false
    },
    {
      id: 2,
      classname: "Physics",
      finishdate: new Date("2011/11/23"),
      startdate: new Date("2011/07/03"),
      building: "kerner",
      room: "202",
      teacher: "Willan",
      starttime: "9:00am",
      endtime: "10:00am",
      sun: false,
      mon: false,
      tue: false,
      wed: false,
      thurs: false,
      fri: false,
      sat: false
    },
    {
      id: 3,
      classname: "Chemistry",
      finishdate: new Date("2011/11/23"),
      startdate: new Date("2011/07/03"),
      building: "chem building",
      room: "202",
      teacher: "taylor",
      starttime: "9:00am",
      endtime: "10:00am",
      sun: false,
      mon: false,
      tue: false,
      wed: false,
      thurs: false,
      fri: false,
      sat: false
    },
  ]

  let testHomework = [
    {
      homeworkid: 1,
      classid: 1,
      homeworkdescription: "math homework",
      schoolclass: "math",
      homeworktype: "Homework",
      duedate: new Date("2011/07/03"),
      duetime: "2:00pm",
      homeworkpriority: "Medium"
    },
    {
      homeworkid: 2,
      classid: 2,
      homeworkdescription: "physics homework",
      schoolclass: "physics",
      homeworktype: "Homework",
      duedate: new Date("2011/07/03"),
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

  before(() =>
    db('school_classes').del().then(() => {
      db('homework_list').del();
    })
  );

  afterEach(() => db('school_classes').del().then(() => {
    db('homework_list').del();
  }));

  after(() => db.destroy());

  context(`Given 'homework' has data`, () => {
    beforeEach(() => {
      return db('school_classes')
        .insert(testItems)
        .then(() => {
          return db('homework_list')
            .insert(testHomework);
        })
    })

    it(`getAllItems() resolves all items from 'homework' table`, () => {
      return HomeworkService.getAllHomework(db)
        .then(actual => {
          expect(actual).to.eql(testHomework);
        })
    })

    it(`getById() resolves a homework by id from 'homework' table`, () => {
      const idToGet = 2;
      const secondItem = testHomework[idToGet - 1];
      return HomeworkService.getById(db, idToGet)
        .then(actual => {
          expect(actual).to.eql(
            secondItem
          );
        })
    })

    it(`deleteItem() removes an homework by id from 'homework' table`, () => {
      const homeworkId = 1;
      return HomeworkService.deleteHomework(db, homeworkId)
        .then(() => HomeworkService.getAllHomework(db))
        .then(allItems => {
          // copy the test items array without the removed item
          const expected = testHomework.filter(homework => homework.homeworkid !== homeworkId);
          expect(allItems).to.eql(expected);
        })
    })

    it(`updateItem() updates an homework from the 'homework' table`, () => {
      const idOfItemToUpdate = 1;
      const newItemData = {
        homeworkdescription: 'physics lab',
      };
      const originalItem = testHomework[idOfItemToUpdate - 1];
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
    beforeEach(() => {
      return db.into('school_classes')
        .insert(testItems)
    });

    it(`getAllItems() resolves an empty array`, () => {
      return HomeworkService.getAllHomework(db)
        .then(actual => {
          expect(actual).to.eql([]);
        })
    })

    it(`insertItem() inserts a homework and resolves the homework with an 'id'`, () => {
      const newItem = {
        homeworkid: 3,
        classid: 2,
        homeworkdescription: "physics lab",
        schoolclass: "physics",
        homeworktype: "Homework",
        duedate: new Date("2011/07/03"),
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