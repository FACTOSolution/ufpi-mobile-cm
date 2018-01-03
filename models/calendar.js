const mongoose = require('mongoose')
const { deleteIdTransform } = require('../util')

/**
 * @swagger
 * definitions:
 *  Event:
 *    type: object
 *    properties:
 *      title:
 *        type: string
 *      startDate:
 *        type: string
 *        format: date-time
 *      endDate:
 *        type: string
 *        format: date-time
 *      startTime:
 *        type: integer
 *      endTime:
 *        type: integer
 *    required:
 *      - title
 *      - startDate
 *      - startTime
 */
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: Date
}, { _id: false })

EventSchema.virtual('startTime').get(function virtualStartTime() {
  return this.startDate.getTime()
})

EventSchema.virtual('endTime').get(function virtualEndTime() {
  return this.endDate ? this.endDate.getTime() : undefined
})

EventSchema.set('toJSON', { virtuals: true, getters: false, transform: deleteIdTransform })

/**
 * @swagger
 * definitions:
 *  Calendar:
 *    type: object
 *    properties:
 *      publisher:
 *        $ref: '#/definitions/User/properties/id'
 *      title:
 *        type: string
 *      year:
 *        type: integer
 *      events:
 *        type: array
 *        items:
 *          $ref: '#/definitions/Event'
 *      createdAt:
 *        type: string
 *        format: date-time
 *    required:
 *      - publisher
 *      - title
 */
const CalendarSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: { type: Number, default: () => (new Date(Date.now())).getFullYear() },
  events: [EventSchema],
  publisher: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true })

CalendarSchema.set('toJSON', { virtuals: true, getters: false, transform: deleteIdTransform, versionKey: false })

const Calendar = mongoose.model('Calendar', CalendarSchema)

module.exports = Calendar
