const SchoolClassService = require('../src/schoolClass/SchoolClassService');
const knex = require('knex');

describe(`School List Service object`, function () {
    let db;
    let testItems = [
        {
            id: 1,
            classname: "Math",
            finishdate: "11-27-2020",
            startdate: "07-06-2020",
            building: "mcld",
            room: "201",
            teacher: "Vidas",
            starttime: "1:00pm",
            endtime: "2:00pm",
            sun: "false",
            mon: "false",
            tue: "false",
            wed: "false",
            thurs: "false",
            fri: "false",
            sat: "false"
        },
        {
            id: 2,
            classname: "Physics",
            finishdate: "11-26-2020",
            startdate: "07-07-2020",
            building: "kerner",
            room: "202",
            teacher: "Willan",
            starttime: "9:00am",
            endtime: "10:00am",
            sun: "false",
            mon: "false",
            tue: "false",
            wed: "false",
            thurs: "false",
            fri: "false",
            sat: "false"
        },

    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
    })

    before(() => db('school_classes').truncate());

    afterEach(() => db('school_classes').truncate());

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
            const classId = 1;
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
            const idOfItemToUpdate = 1;
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
                finishdate: "11-26-2020",
                startdate: "7-07-2020",
                building: "kerner",
                room: "202",
                teacher: "Willan",
                starttime: "9:00am",
                endtime: "10:00am",
                sun: "false",
                mon: "false",
                tue: "false",
                wed: "false",
                thurs: "false",
                fri: "false",
                sat: "false"
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