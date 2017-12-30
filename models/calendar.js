const mongoose = require('mongoose')

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
 *    required:
 *      - title
 *      - startDate
 */
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: Date
}, { _id: false })

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
  year: { type: Number, default: () => (new Date()).getFullYear() },
  events: [EventSchema],
  publisher: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true })

const Calendar = mongoose.model('Calendar', CalendarSchema)

module.exports = Calendar
