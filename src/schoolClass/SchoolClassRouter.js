const express = require('express')
//const xss = require('xss')
const SchoolClassService = require('./SchoolClassService')

const SchoolClassRouter = express.Router()
const jsonParser = express.json()

const serializeSchoolClass = schoolClass => ({
  id: schoolClass.id,
  classname: schoolClass.classname,
  finishdate: schoolClass.finishdate,
  startdate: schoolClass.startdate,
  building: schoolClass.building,
  room: schoolClass.room,
  teacher: schoolClass.teacher,
  starttime: schoolClass.starttime,
  endtime: schoolClass.endtime,
  sun: schoolClass.sun,
  mon: schoolClass.mon,
  tue: schoolClass.tue,
  wed: schoolClass.wed,
  thurs: schoolClass.thurs,
  fri: schoolClass.fri,
  sat: schoolClass.sat
  
});

SchoolClassRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    SchoolClassService.getAllSchoolClasses(knexInstance)
      .then(schoolClasses => {
        res.json(schoolClasses.map(serializeSchoolClass))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const newSchoolClass = req.body;

    SchoolClassService.insertSchoolClass(
      req.app.get('db'),
      newSchoolClass
    )
      .then(newShoolClass => {
        res
          .status(201)
          .location(req.originalUrl + `/${newShoolClass.id}`)
          .json(serializeSchoolClass(newShoolClass))
      })
      .catch(next)
  })

SchoolClassRouter
  .route('/:schoolClass_id')
  .all((req, res, next) => {
    SchoolClassService.getById(
      req.app.get('db'),
      req.params.schoolClass_id
    )
      .then(schoolClass => {
        if (!schoolClass) {
          return res.status(404).json({
            error: { message: `School class doesn't exist` }
          })
        }
        res.schoolClass = schoolClass
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeSchoolClass(res.schoolClass))
  })
  .delete((req, res, next) => {
    SchoolClassService.deleteSchoolClass(
      req.app.get('db'),
      req.params.schoolClass_id
    )
    .then(newShoolClass => {
      console.log(newShoolClass)
      res
        .status(201)
        .send(serializeSchoolClass(newShoolClass))
    })
      .catch(next)
  })

  .patch(jsonParser, (req, res, next) => {
    const schoolClassToUpdate = req.body;
    schoolClassToUpdate.id = req.params.schoolClass_id;
    console.log(schoolClassToUpdate);

    SchoolClassService.updateSchoolClass(
      req.app.get('db'),
      req.params.schoolClass_id,
      schoolClassToUpdate
    )
      .then(numRowsAffected => {
        SchoolClassService.getById(req.app.get('db'), schoolClassToUpdate.id)
        .then(schoolClass => { res.status(200).json(serializeSchoolClass(schoolClass)) });

    })
    .catch(next);
  })

module.exports = SchoolClassRouter
