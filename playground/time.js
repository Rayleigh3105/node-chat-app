var moment = require('moment')


// var date = new Date();
// var months = ['Jan', 'Feb'];
// console.log(date.getMonth());

var date = moment();
date.add(1, 'year')
console.log( date.format('MMM Do, YYYY') )
