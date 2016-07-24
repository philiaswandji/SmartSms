

  angular.module('starter.services', [])

  .factory('MessageService',function($cordovaSms,$ionicPlatform){
      var translate = {
        "nickname":"prenom",
        "displayName":"nom"
      };
      var options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
          intent: '' // send SMS with the native android SMS messaging
          //intent: '' // send SMS without open any other app
          //intent: 'INTENT' // send SMS inside a default SMS app
        }
      };
      var recSend=function(contacts,ContactService,texte,i){

        if(i>=contacts.length){
          return true;
        }else if(i>=0){
          var ntexte = texte;
          ContactService.fields.forEach(function(value){
            var t = '$'+translate[value]+'$';
            ntexte = ntexte.replace(t,contacts[i][value]);
          })
          console.log(ntexte);
          $ionicPlatform.ready(function(){
            console.log("on envoi pour le "+i);
            //recSend(contacts,ContactService,texte,i+1);
            contacts[i].showSpinner=true;
            contacts[i].success=false;
            contacts[i].fail=false;
            console.log(contacts[i].tel);
            $cordovaSms.send(contacts[i].tel,ntexte, options)
              .then(function() {
                contacts[i].success=true;
                contacts[i].showSpinner=false;
                recSend(contacts,ContactService,texte,i+1);
                // Success! SMS was sent
              }, function(error) {
                contacts[i].fail=true;
                contacts[i].showSpinner=false;
                recSend(contacts,ContactService,texte,i+1);
                // An error occurred
              });
          })
        }
      }
    return {
      texte:'',
      send:function(contacts,ContactService,texte){
        recSend(contacts,ContactService,texte,0);
        console.log("Envoi termine");
      },
      setText:function(texte){
        this.texte=texte;
      }
      }
    })

  .factory('ContactService',function($cordovaContacts,$ionicPlatform) {
      return {
        fields: ['nom', 'tel'],     //The differents fields of a contact, or a recipient, if using contacts of the phone
        phoneField:'',
        setPhoneField:function(phoneField){
          this.phoneField=phoneField;
        },
        getFieldsFromContact: function(contact){
          var fields = [];
          angular.forEach(contact,function(value,key){
            fields.push(key);
          }
          )
          this.fields=fields;
          return fields;
        },
        getFieldsFromFile: function () {     //get all the fields of a contact, if using a file for importing contacts

          var allfields = [];
          this.fields = allfields;
          return allfields;
        },
        //all the contacts to whom sms will be sent
        setFinalContacts: function (contacts) {
          this.finalContacts = contacts;
        },

        setPhone:function(contacts,source){
        if(source==0){      //Les contacts sont sélectionnés à partir de la liste des contacts
            contacts.forEach(function(value){
              value.tel=value.phoneNumbers[0].value;
            })
          }
          if(source==1){

          }
      }
      }
    })

