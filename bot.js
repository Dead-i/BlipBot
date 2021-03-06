var fs = require('fs');
var util = require('./services/util');
var mongo = require('mongodb').MongoClient;
var async = require('async');
var log = require('log4js').getLogger('MAIN');

var config = JSON.parse(fs.readFileSync('config.json'));
var services = {};

log.info('Starting BlipBot Chat Bot.');

var web = require('./core/server');
connectMongo(function(db) {
	web = new web(config, db, services, util.modules);
	db.collection('services').find({}).toArray(function(err, rows) {
		async.eachSeries(rows, function(row, cb) {
			util.registerService(config, db, web, row, function(service) {
				services[row._id] = service;
				cb();
			});
		}, function() {
			log.info('Services registered.');
		});
	});
});

function connectMongo(cb) {
	log.info('Connecting to MongoDB...');
	mongo.connect('mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.name, function(err, db) {
		if (err) {
			throw err;
		}
		
		db.authenticate(config.db.username, config.db.password, function(err, result) {
			if (err || !result) {
				return log.warn('Unable to authenticate with MongoDB.');
			}
			
			cb(db);
		});
	});
}