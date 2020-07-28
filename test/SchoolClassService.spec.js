const SchoolClassService = require('../src/schoolClass/SchoolClassService');
const HomeworkService = require('../src/homework/HomeworkService');
const knex = require('knex');

describe(`School List Service object`, function () {
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

    before(() => {
        console.log("huh?");
        // knex('school_classes').truncate();
        return db('school_classes').del()
      
        //  db('homework_list').truncate();
        //db('school_classes').truncate();
        // knex.raw('TRUNCATE TABLE school_classes CASCADE')
    }
    );

    afterEach(() => {
        console.log("why aren't you truncating?");
        //knex('school_classes').truncate();
        //   knex.raw('TRUNCATE TABLE school_classes CASCADE')
        //  db('homework_list').truncate();
       return  db('school_classes').del()
    }
    );

    after(() => db.destroy());

    context(`Given 'school classes' has data`, () => {
        beforeEach(() => {
            return db
                .into('school_classes')
                .insert(testItems);
        })

        it(`getAllItems() resolves all items from 'school_classes' table`, () => {

            return SchoolClassService.getAllSchoolClasses(db)
                .then(actual => {
                    expect(actual).to.eql(testItems);
                })
        })

        it(`getById() resolves an article by id from 'school_classes' table`, () => {
            const idToGet = 2;
            const secondItem = testItems[idToGet - 1];
            return SchoolClassService.getById(db, idToGet)
                .then(actual => {
                    expect(actual).to.eql(
                        secondItem
                    );
                })
        })

        it(`deleteItem() removes a schoolClass ;by id from 'school' table`, () => {
            const classId = 3;
            return SchoolClassService.deleteSchoolClass(db, classId)
                .then(() => SchoolClassService.getAllSchoolClasses(db))
                .then(allItems => {
                    // copy the test items array without the removed item
                    const expected = testItems
                        .filter(schoolClass => schoolClass.id !== classId);
                    expect(allItems).to.eql(expected);
                })
        })

        it(`updateItem() updates an show from the 'show' table`, () => {
            const idOfItemToUpdate = 2;
            const newItemData = {
                classname: 'Biology',
            };
            const originalItem = testItems[idOfItemToUpdate - 1];
            return SchoolClassService.updateSchoolClass(db, idOfItemToUpdate, newItemData)
                .then(() => SchoolClassService.getById(db, idOfItemToUpdate))
                .then(schoolClass => {
                    expect(schoolClass).to.eql({
                        id: idOfItemToUpdate,
                        ...originalItem,
                        ...newItemData,
                    });
                })
        })

        ////
        ///
        //
        //
      
    })




    context(`Given 'schoolclasss' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
            return SchoolClassService.getAllSchoolClasses(db)
                .then(actual => {
                    expect(actual).to.eql([]);
                })
        })

        it(`insertItem() inserts an schoolclass and resolves the SchoolClass with an 'id'`, () => {
            const newItem = {
                id: 3,
                classname: "Chemistry",
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
            };
            return SchoolClassService.insertSchoolClass(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 3,
                        ...newItem
                    });
                })
        })
    })


})