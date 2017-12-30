const mongoose = require('mongoose')

/**
 * @swagger
 * definitions:
 *  MenuOption:
 *    type: object
 *    properties:
 *      name:
 *        type: string
 *      open:
 *        type: boolean
 *      known:
 *        type: boolean
 *      meals:
 *        type: object
 *    required:
 *      - name
 *      - open
 *      - known
 */
const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  open: { type: Boolean, required: true },
  known: { type: Boolean, required: true },
  meals: mongoose.SchemaTypes.Mixed
}, { _id: false })

/**
 * @swagger
 * definitions:
 *  MenuDay:
 *    type: object
 *    properties:
 *      day:
 *        type: integer
 *        minimum: 0
 *        maximum: 6
 *      lunch:
 *        $ref: '#/definitions/MenuOption'
 *      dinner:
 *        $ref: '#/definitions/MenuOption'
 */
const DaySchema = new mongoose.Schema({
  day: { type: Number, min: 0, max: 6 },
  lunch: [RestaurantSchema],
  dinner: [RestaurantSchema]
}, { _id: false })

/**
 * @swagger
 * definitions:
 *  Menu:
 *    type: object
 *    properties:
 *      publisher:
 *        $ref: '#/definitions/User/properties/id'
 *      startDate:
 *        type: string
 *        format: date-time
 *      endDate:
 *        type: string
 *        format: date-time
 *      monday:
 *        $ref: '#/definitions/MenuDay'
 *      tuesday:
 *        $ref: '#/definitions/MenuDay'
 *      wednesday:
 *        $ref: '#/definitions/MenuDay'
 *      thursday:
 *        $ref: '#/definitions/MenuDay'
 *      friday:
 *        $ref: '#/definitions/MenuDay'
 *      saturday:
 *        $ref: '#/definitions/MenuDay'
 *    required:
 *      - publisher
 *      - startDate
 *      - endDate
 *      - monday
 *      - tuesday
 *      - wednesday
 *      - thursday
 *      - friday
 *      - saturday
 */
const MenuSchema = new mongoose.Schema({
  monday: { type: DaySchema, required: true },
  tuesday: { type: DaySchema, required: true },
  wednesday: { type: DaySchema, required: true },
  thursday: { type: DaySchema, required: true },
  friday: { type: DaySchema, required: true },
  saturday: { type: DaySchema, required: true },
  publisher: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
}, { timestamps: true })

const Menu = mongoose.model('Menu', MenuSchema)

module.exports = Menu
