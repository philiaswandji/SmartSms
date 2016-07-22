

angular.module('starter.services', [])

.factory('MessageService',function($cordovaSms,$ionicPlatform){
  return {
    mytext : "bonjour $nom$ ca va?",
    sendOne:function(contact,ContactService,text){
      ContactService.fields.forEach(function(value){
        var t = '$'+value+'$';
        text = text.replace(t,contact[value]);
        console.log(text);
      })
      this.sendSms(text,contact['tel']);
      return true;
      },
    sendMany:function(contacts){
      var result=[];
      contacts.forEach(function(contact){
        var isOk=this.sendOne(contact,ContactService);
        result.push(isOk);
      });
      return result;
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
        $ionicPlatform.ready(function(){
          $cordovaSms.send(number,message, options)
            .then(function() {
              alert('Success');
              return true;
              // Success! SMS was sent
            }, function(error) {
              alert('Error : '+error);
              return false;
              // An error occurred
            });
        })

    }
    }
  })

.factory('ContactService',function($cordovaContacts,$ionicPlatform) {
    return {
      fields: ['nom', 'tel'],     //The differents fields of a contact, or a recipient, if using contacts of the phone
      getFieldsFromFile: function () {     //get all the fields of a contact, if using a file for importing contacts

        var allfields = [];
        this.fields = allfields;
        return allfields;
      },
      contacts: [
        {nom: "philias", tel: "5554"},
        {nom: "wandji", tel: "5556"}
      ],              //all the contacts to whom sms will be sent
      setFinalContacts: function (contacts) {
        this.finalContacts = contacts;
      },

      getAllContactsFromPhone: function () {       //Get all contacts of the phone of the user
        var contacts = [];
        $ionicPlatform.ready(function(){
          $cordovaContacts.find({filter: '',multiple:true}).then(function (allContacts) { //omitting parameter to .find() causes all contacts to be returned
            contacts = allContacts;
            alert(JSON.stringify(contacts));
            return contacts;
          },function(error){
            alert('Error : '+error);
            console.log(error);
          })
         // return contacts;
        })

      }
    }
  })

