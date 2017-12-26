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
