var psd = require("./psd-api.js");

var ids = ["21761604071829", "06001706200047", "22291706212123"];
ids.forEach(function(id) {
    psd.getName(id, function(personsArr) {
        personsArr.forEach(function(person) {
            console.log(person);
        });
    });
});


// psd.getMedicalReport("userinput", function(report){

// });

// psd.getEmirate("userinput", function(emirate){

// });
