const mongoose = require('mongoose')

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  open: { type: Boolean, required: true },
  known: { type: Boolean, required: true },
  meals: mongoose.SchemaTypes.Mixed
}, { _id: false })

const DaySchema = new mongoose.Schema({
  day: { type: Number, min: 0, max: 6 },
  lunch: [RestaurantSchema],
  dinner: [RestaurantSchema]
}, { _id: false })

const MenuSchema = new mongoose.Schema({
  monday: DaySchema,
  tuesday: DaySchema,
  wednesday: DaySchema,
  thursday: DaySchema,
  friday: DaySchema,
  saturday: DaySchema,
  publisher: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: Date,
  endDate: Date
})

const Menu = mongoose.model('Menu', MenuSchema)

module.exports = Menu