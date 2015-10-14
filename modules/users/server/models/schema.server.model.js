'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Validation
 */

/**
 * Category Schema
 */
var modelSchema = new Schema({
    // the property name
    _id: {         
        type: String  
    },
    sku_num: {
        type: String
    },
    revenue: {
        type: Number
    },
    fba_dollars: {
        type: Number
    },
    fba_percent: {
        type: Number
    },
    commission: {
        type: Number
    },
    profit_marg: {
        type: Number
    },
    product_marg: {
        type: Number
    }
});

// Expose the model to other objects (similar to a 'public' setter).
mongoose.model('Schema', modelSchema);