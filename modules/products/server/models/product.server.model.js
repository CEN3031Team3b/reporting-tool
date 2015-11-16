'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * product Schema
 */
// var productSchema = new Schema({
//   shipment_fee_type: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   marketplace_name: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   shipment_id: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   adjustment_id: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   merchant_order_id: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   order_id: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   transaction_type: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   currency: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   total_amount: {
//     type: String,
//     default: 0.0
//   },
//   depositdate: {
//     type: Date,
//     default: Date.now
//   },
//   settlement_end_date: {
//     type: Date,
//     default: Date.now
//   },
//   settlement_start_date: {
//     type: Date,
//     default: Date.now
//   },
//   settlement_id: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   shipment_fee_amount: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   order_fee_type: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   order_fee_amount: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   fulfillment_id: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   posted_date: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   order_item_code: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   merchant_order_item_id: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   merchant_adjustment_item_id: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   sku: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   quantity_purchased: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   item_related_fee_type: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   item_related_fee_amount: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   other_fee_amount: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   other_fee_reason_description: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   misc_fee_amount: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   price_amount: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   price_type: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   other_amount: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   direct_payment_amount: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   direct_payment_type: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   promotion_amount: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   promotion_type: {
//     type: String,
//     default: '',
//     trim: true
//   },
//   promotion_id: {
//     type: String,
//     default: '',
//     trim: true
//   }
// });

var productSchema = new Schema({
  dateOrdered: {
    type: String, //can this be of type date???
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
  price: {
    type: String,
    default: '',
    trim: true
  }
});

mongoose.model('product', productSchema);
