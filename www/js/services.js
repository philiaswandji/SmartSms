
var translate = function(string){
  if(string=='nickname'){
    return 'prenom';
  }
  else if(string=='displayName'){
    return 'nom';
  }
  else{
    return string;
  }
}
  angular.module('starter.services', [])

  .factory('MessageService',function($cordovaSms,$ionicPlatform){
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
            var t = '$'+translate(value)+'$';
            ntexte = ntexte.replace(t,contacts[i][value]);
          })
          console.log(ntexte);
          $ionicPlatform.ready(function(){
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
        source:0,
        setSource : function(source){
          this.source = source;
        },
        getFinalFields : function(){
          if(this.source==0){
            var fields = [];
            this.fields = this.getFieldsFromContact(this.finalContacts[0]);
            this.fields.forEach(function(val){
              fields.push(translate(val));
            })
            return fields;
          }
          else if(this.source==1){
            return this.getFieldsFromFile();
          }
        },
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

    .factory("$fileFactory", function($q) {

      var File = function() { };

      File.prototype = {

        getParentDirectory: function(path) {        //Get the parent of the current directory
          var deferred = $q.defer();
          window.resolveLocalFileSystemURI(path, function(fileSystem) {
            fileSystem.getParent(function(result) {
              deferred.resolve(result);
            }, function(error) {
              deferred.reject(error);
              console.log(error);
            });
          }, function(error) {
            deferred.reject(error);
            console.log(error);
          });
          return deferred.promise;
        },

        getEntriesAtRoot: function() {          //Get all the files and directories at the root of the phone
          var deferred = $q.defer();
          window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            var directoryReader = fileSystem.root.createReader();
            directoryReader.readEntries(function(entries) {
              deferred.resolve(entries);
            }, function(error) {
              deferred.reject(error);
              console.log(error);
            });
          }, function(error) {
            deferred.reject(error);
            console.log(error);
          });
          return deferred.promise;
        },

        getEntries: function(path) {          //Get all the entries at the current directory
          var deferred = $q.defer();
          window.resolveLocalFileSystemURI(path, function(fileSystem) {
            var directoryReader = fileSystem.createReader();
            directoryReader.readEntries(function(entries) {
              deferred.resolve(entries);
            }, function(error) {
              deferred.reject(error);
              console.log(error);
            });
          }, function(error) {
            deferred.reject(error);
            console.log(error);
          });
          return deferred.promise;
        }

      };

      return File;

    })

