const express = require('express')
//const xss = require('xss')
const FoldersService = require('./SchoolClassService')

const SchoolClassRouter = express.Router()
const jsonParser = express.json()

const serializeSchoolClass = schoolClass => ({
  id: schoolClass.classId,
  className: schoolClass.className,
  finishDate: schoolClass.finishDate,
  startDate: schoolClass.startDate,
  building: schoolClass.building,
  room: schoolClass.room,
  teacher: schoolClass.teacher, 
  startTime:schoolClass.startTime,
  endTime:schoolClass.endTime,
  Sun: schoolClass.dayOfWeek.Sun,
  Mon: schoolClass.dayOfWeek.Mon,
  Tue: schoolClass.dayOfWeek.Tue,
  Wed: schoolClass.dayOfWeek.Wed,
  Thurs: schoolClass.dayOfWeek.Thurs,
  Fri: schoolClass.dayOfWeek.Fri,
  Sat: schoolClass.dayOfWeek.Sat    
});

SchoolClassRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    FoldersService.getAllFolders(knexInstance)
      .then(articles => {
        res.json(articles.map(serializeFolder))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const newShoolClass = req.body;
   
    
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
    FoldersService.getById(
      req.app.get('db'),
      req.params.schoolClass_id
    )
      .then(schoolClass => {
        if (!schoolClass) {
          return res.status(404).json({
            error: { message: `Folder doesn't exist` }
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
       const { schoolClass } = req.body
       const schoolClassToUpdate = { schoolClass }
    

       const numberOfValues = Object.values(schoolClassToUpdate).filter(Boolean).length
          if (numberOfValues === 0) {
            return res.status(400).json({
              error: {
                message: `Request body must contain either 'title', 'style' or 'content'`
              }
            })
          }
    
       schoolClassService.updateSchoolClass(
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