const mongoose = require('mongoose')
const { dateStringFrom, timeStringFrom, deleteIdTransform, applyTransforms } = require('../util')

/**
 * @swagger
 * definitions:
 *  NewNotification:
 *    type: object
 *    properties:
 *      title:
 *        type: string
 *      location:
 *        type: string
 *      startDate:
 *        type: string
 *        format: date-time
 *  Notification:
 *    type: object
 *    properties:
 *      title:
 *        type: string
 *      location:
 *        type: string
 *      startDate:
 *        type: string
 *        format: date-time
 *      data:
 *        type: string
 *      hora:
 *        type: string
 *      createdAt:
 *        type: string
 *        format: date-time
 */
const NotificationSchema = new mongoose.Schema({
  title: { type: String },
  location: { type: String },
  startDate: { type: Date },
  publisher: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true })

NotificationSchema.virtual('data').get(dateStringFrom('startDate'))

NotificationSchema.virtual('hora').get(timeStringFrom('startDate'))

NotificationSchema.set('toJSON', { virtuals: true, getters: false, versionKey: false, transform: applyTransforms(transform, deleteIdTransform) })

function transform(_, ret, _) {
  delete ret.publisher
  delete ret.updatedAt
  return ret
}

module.exports = mongoose.model('Notification', NotificationSchema)