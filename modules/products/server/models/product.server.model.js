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
  dateOrdered: {
    type: String, //can this be of type date???
    default: '',
    trim: true
  },
  user: {
    type: String,
    default: '',
    trim: true
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
    type: String,
    default: '',
    trim: true
  },
  price: { //amount user spent on item
    type: String,
    default: '',
    trim: true
  },
  cost: { //cost of producing/company purchased item
    type: String,
    default: '0',
    trim: true
  },
  brand: {
    type: String,
    default: 'Please input brand',
    trim: true
  },
  fbaAmt: {
    type: String,
    default: '',
    trim: true
  },
  fbaPct: {
    type: String,
    default: '',
    trim: true
  },
  profitMargin: {
    type: String,
    default: '',
    trim: true
  },
  productMargin: {
    type: String,
    default: '',
    trim: true
  }
});

mongoose.model('product', productSchema);
