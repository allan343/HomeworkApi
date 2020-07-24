const express = require('express')
//const xss = require('xss')
const HomeworkService = require('./HomeworkService')

const HomeworkRouter = express.Router()
const jsonParser = express.json()

const serializeHomework = homework => ({
  homeworkid: homework.homeworkid,
  classid: homework.classid,
  homeworkdescription: homework.homeworkdescription,
  schoolclass: homework.schoolclass,
  homeworktype: homework.homeworktype,
  duedate: homework.duedate,
  duetime: homework.duetime,
  priority: homework.homeworkpriority
})

HomeworkRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    HomeworkService.getAllHomework(knexInstance)
      .then(homeworkList => {
        res.json(homeworkList.map(serializeHomework))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const newHomework = req.body;
      console.log(newHomework);
    HomeworkService.insertHomework(
      req.app.get('db'),
      newHomework
    )
      .then(newHomework => {
        res
          .status(201)
          .location(req.originalUrl + `/${newHomework.id}`)
          .json(serializeHomework(newHomework))
      })
      .catch(next)
  })

HomeworkRouter
  .route('/:homework_id')
  .all((req, res, next) => {
    HomeworkService.getById(
      req.app.get('db'),
      req.params.homework_id
    )
      .then(homework => {
        if (!homework) {
          return res.status(404).json({
            error: { message: `Homework doesn't exist` }
          })
        }
        res.homework = homework
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeHomework(res.homework))
  })
  .delete((req, res, next) => {
    HomeworkService.deleteHomework(
      req.app.get('db'),
      req.params.homework_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

   .patch(jsonParser, (req, res, next) => {
      
       
    const newHomework = req.body;
    newHomework.id = req.params.homework_id;

    HomeworkService.updateHomework(
      req.app.get('db'),
      newHomework.id,
      newHomework
    )
      .then(numRowsAffected => {

        HomeworkService.getById(req.app.get('db'), newShow.id)
          .then(homework => { res.status(200).json(serializeHomework(homework)) });

      })
      .catch(next);
  })

module.exports = HomeworkRouter