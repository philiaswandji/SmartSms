

angular.module('starter.services', [])

.factory('MessageService',function($cordovaSms){
  return {
    mytext : "bonjour $nom$ ca va?",
    sendOne:function(contact,ContactService,text){
      ContactService.fields.forEach(function(value){
        var t = '$'+value+'$';
        text = text.replace(t,contact[value]);

      })
      return true;
      },
    sendSms:function(message,number){

      var options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
          intent: '' // send SMS with the native android SMS messaging
          //intent: '' // send SMS without open any other app
          //intent: 'INTENT' // send SMS inside a default SMS app
        }
      };

      $scope.sendSMS = function() {

        $cordovaSms
          .send(number,message, options)
          .then(function() {
            alert('Success');
            // Success! SMS was sent
          }, function(error) {
            alert('Error');
            // An error occurred
          });
      }
    }
    }
  })

.factory('ContactService',function(){
  return {
    fields : ['nom','tel'],     //The differents fields of a contact, or a recipient, if using contacts of the phone
    getFieldsFromFile : function(){     //get all the fields of a contact, if using a file for importing contacts

     var allfields = [];
      this.fields = allfields;
      return allfields;
    },
    contacts : [
      {nom:"philias",tel:"695978619"},
      {nom:"wandji",tel:"695978619"}
    ],              //all the contacts to whom sms will be sent
    setFinalContacts : function(contacts){
      this.finalContacts = contacts;
    },

    gelAllContactsFromPhone : function(){       //Get all contacts of the phone of the user
      var contacts = [];

      return contacts;
    }


  }
  })

