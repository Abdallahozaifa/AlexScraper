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

     // Polyfill for Object.assign and String.endsWith
     var objectAssign = require('object-assign');
     require('string.prototype.endswith');
     var pub = {};
     var priv = {};
     var errorArr = [];

     /* Removes by value */
     Array.prototype.remove = function() {
         var what, a = arguments,
             L = a.length,
             ax;
         while (L && this.length) {
             what = a[--L];
             while ((ax = this.indexOf(what)) !== -1) {
                 this.splice(ax, 1);
             }
         }
         return this;
     };

     /* object that contains all possible errors */
     var generalError = {
         generateInvalidUrl: function(error) {
             errorArr.push(errorArr);
             console.log("ERROR: Invalid URL!");
         }
     };

     priv.processRequest = function(ACC_ID, callback) {
         request('http://ims2.saaed.ae/ims/generatReportForSaaed?ACC_ID=' + ACC_ID, function(err, res, body) {
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
                 const $ = cheerio.load(body, {
                     ignoreWhitespace: true
                 });
                 callback($);
             }
         });
     };

     /**
      * Fills the student info object.
      * @function
      * @param {string} ACC_ID - The accident id of a RTC incident.
      * @param function callback - The callback that returns a person array
      */
     pub.getName = function(ACC_ID, callback) {

         /* function that processes the request */
         priv.processRequest(ACC_ID, function($) {
             var personsArr = [];
             /**
              * Creates a new person object
              * @function
              * @param {string} ACC_ID - The accident id of a RTC incident.
              * @param function callback - The callback that returns a person array
              */
             function Person(name, role, gender, DOB) {
                 this.name = name;
                 this.role = role;
                 this.gender = gender;
                 this.DOB = DOB;
             }

             /* Creates a new person object with a driver attribute and adds it to the person array */
             $("#DataList1_ctl00_OWNER_NAMELabel").each(function() {
                 var ownerName = $(this).text();
                 personsArr.push(new Person(ownerName, "OWNER", "NULL", "NULL"));
             });

             var driverNames = [];
             /* Adds each driver to a separate drivers array */
             $("#DataList1_ctl00_DRIVER_NAMELabel").each(function() {
                 var driverName = $(this).text();
                 driverNames.push(driverName);
             });

             var driverCount = 0;
             /* Finds each person who is a owner and adds them as a driver if applicable */
             personsArr.forEach(function(person) {
                 driverNames.forEach(function(driverName) {
                     if (person.name == driverName) {
                         person.role = "DRIVER, OWNER";
                         driverNames.remove(person.name);
                     }
                     driverCount++;
                 });
             });

             /* Creates a new person object with a driver attribute */
             driverNames.forEach(function(driverName) {
                 personsArr.push(new Person(driverName, "DRIVER", "NULL", "NULL"));
             });

             callback(personsArr);
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
 