const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  startDate: { type: Date, required: true },
  endDate: Date
}, { _id: false })

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
