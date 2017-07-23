 /****************************************
  *     PENN STATE DIRECTORY API         *
  ****************************************/
 (function() {
     /* Imports */
     var request = require('request');
     var querystring = require('querystring');
     var cheerio = require('cheerio');
     var fs = require('fs');
     var http = require('http');
     var agent = new http.Agent;
     agent.maxSockets = 10;
     var $;

     // Polyfill for Object.assign and String.endsWith
     var objectAssign = require('object-assign');
     require('string.prototype.endswith');
     var pub = {};
     var errorArr = [];

     var generalError = {
         generateInvalidUrl: function(error) {
             errorArr.push(errorArr);
             console.log("ERROR: Invalid URL!");
         }
     };

     pub.getName = function(input, callback) {
         request('http://ims2.saaed.ae/ims/generatReportForSaaed?ACC_ID=21761604071829', function(err, res, body) {
             // Server does not exist
             if (res == undefined) {
                 generalError.generateInvalidUrl(err);
             }
             // Server does exist but returns 404 
             else if (err && res.statusCode != 200) {
                 generalError.generateInvalidUrl(err);
             }
             // Server returns html
             else {
                 $ = cheerio.load(body, {
                     ignoreWhitespace: true
                 });

                 var personsArr = [];

                 function Person(name, role, gender, DOB) {
                     this.name = name;
                     this.role = role;
                     this.gender = gender;
                     this.DOB = DOB;
                 }

                 $("#DataList1_ctl00_OWNER_NAMELabel").each(function() {
                     var ownerName = $(this).text();
                     personsArr.push(new Person(ownerName, "OWNER", "NULL", "NULL"));
                 });

                var driverNames = [];
                 $("#DataList1_ctl00_DRIVER_NAMELabel").each(function() {
                     var driverName = $(this).text();
                     driverNames.push(driverName);
                 });
                 
                 var driverCount = 0;
                 personsArr.forEach(function(person){
                     driverNames.forEach(function(driverName){
                         if(person.name == driverName){
                             person.role = "DRIVER, OWNER";
                             driverNames.splice(1, driverCount);
                         }
                         driverCount++;
                     });
                 });
                 
                 driverNames.forEach(function(driverName){
                     personsArr.push(new Person(driverName, "DRIVER", "NULL", "NULL"));
                 });

                 console.log(personsArr);
             }
         });
     };

     pub.getMedicalReport = function(input, callback) {
         console.log("GET INFO!");
     };

     pub.getEmirate = function(input, callback) {
         console.log("GET INFO!");
     };

     /* EXPORTS the psd-api in node */
     module.exports = pub;
 }).call(this);
 