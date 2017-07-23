var psd = require("./psd-api.js");

psd.getName("userinput", function(personsArr){
    personsArr.forEach(function(person){
        console.log(person);
    });
});

// psd.getMedicalReport("userinput", function(report){
    
// });

// psd.getEmirate("userinput", function(emirate){
    
// });


