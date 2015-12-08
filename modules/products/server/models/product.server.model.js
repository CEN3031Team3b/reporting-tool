'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * product Schema
 */
var productSchema = new Schema({
  purchaseDate: {
    type: Date
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },  
  orderID: {
    type: String,
    default: '',
    trim: true
  },
  sku: {
    type: String,
    default: '',
    trim: true
  },
  quantity: {
    type: Number,
    default: 0
  },
  price: { //amount user spent on item
    type: Number,
    default: 0
  },
  cost: { //cost of producing/company purchased item
    type: Number,
    default: 0
  },
  revenue: { //quantity * price
    type: Number,
    default: 0
  },
  brand: {
    type: String,
    default: 'Please input brand',
    trim: true
  },
  fbaAmt: {
    type: Number,
    default: 0
  },
  fbaPct: {
    type: Number,
    default: 0
  },
  profitMargin: {
    type: Number,
    default: 0
  },
  productMargin: {
    type: Number,
    default: 0
  }
});

mongoose.model('product', productSchema);
