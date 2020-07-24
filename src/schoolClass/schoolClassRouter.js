const express = require('express')
//const xss = require('xss')
const SchoolClassService = require('./SchoolClassService')

const SchoolClassRouter = express.Router()
const jsonParser = express.json()

const serializeSchoolClass = schoolClass => ({
  id: schoolClass.classid,
  classname: schoolClass.classdame,
  finishDate: schoolClass.finishdate,
  startDate: schoolClass.startdate,
  building: schoolClass.building,
  room: schoolClass.room,
  teacher: schoolClass.teacher, 
  starttime:schoolClass.starttime,
  endtime:schoolClass.endtime,
  dayOfWeek:{
    sun: schoolClass.sun,
            mon: schoolClass.mon,
            tue: schoolClass.tue,
            wed: schoolClass.wed,
            thurs: schoolClass.thurs,
            fri: schoolClass.fri,
            sat: schoolClass.sat
    }

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
    console.log("mynewclass "+ newSchoolClass.classame);
    console.log("mynewclass "+ newSchoolClass.finishate);
    console.log("mynewclass "+ newSchoolClass.startate);
    console.log("mynewclass "+ newSchoolClass.building);
    console.log("mynewclass "+ newSchoolClass.room);
    console.log("mynewclass "+ newSchoolClass.teacher);
    console.log("mynewclass "+ newSchoolClass.startime);
    console.log("mynewclass "+ newSchoolClass.endtime);
    console.log("mynewclass "+ newSchoolClass.dayOfWeek);

   
    
/*
    for (const [key, value] of Object.entries(newFolder))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
        //newFolder.author = author*/
    SchoolClassService.insertSchoolClass(
      req.app.get('db'),
      newSchoolClass
    )
      .then(newShoolClass => {
        console.log(newShoolClass)
        res
          .status(201)
         // .location(`/folders/${folder.id}`)
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
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

   .patch(jsonParser, (req, res, next) => {
       const { schoolClassToUpdate,schoolClass } = req.body;
       console.log(schoolClassToUpdate);
      // const schoolClassToUpdate = { schoolClass };
    
    /*
       const numberOfValues = Object.values(schoolClassToUpdate).filter(Boolean).length
          if (numberOfValues === 0) {
            return res.status(400).json({
              error: {
                message: `Request body must contain either 'title', 'style' or 'content'`
              }
            })
          }
    */
       SchoolClassService.updateSchoolClass(
         req.app.get('db'),
         req.params.schoolClass_id,
         schoolClassToUpdate
       )
         .then(numRowsAffected => {
           res.status(204).end()
         })
         .catch(next)
      })

module.exports = SchoolClassRouter