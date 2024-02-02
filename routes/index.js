var express = require('express');
var router = express.Router();

const Door = require('../models/Door');
const moment = require('moment');
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;
/* GET home page. */
router.get('/', async function(req, res, next) {
  var dateDebut = moment().subtract('day', 7);
  let query = { date: { $gte: dateDebut.toISOString() } };
  let response = await Door.find( query );

  let donneesGraphique = {}
  response.forEach( r => {
    let d = moment(r.date).format('YYYY-MM-DD');  
    if( donneesGraphique[d] == undefined ) donneesGraphique[d] = 0;
    else donneesGraphique[d]++; 
  });
  
  let donnnes_arr = [];
  Object.keys(donneesGraphique).forEach( ( key, idx ) => {
    donnnes_arr.push({
      date: key,
      valeur: donneesGraphique[key]
    });
  });  
  res.render('index', { titre: 'Mon Document', donnees: donnnes_arr });
});

module.exports = router;

