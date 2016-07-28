
var contacts = [];
function getSelected(allContacts){
  var result = [];
  allContacts.forEach(function (value) {
    if(value['checked']){
      result.push(value);
    }
  })
  return result;
}
angular.module('starter.controllers', [])

.controller('messageCtrl',function($scope,MessageService,ContactService,$state,$ionicModal){

    $scope.obj={};
    $scope.obj.texte='';
    $scope.texte='';
    $scope.fields = ContactService.getFinalFields();
    $scope.valider=function(){
      console.log($scope.obj.texte);
      MessageService.setText($scope.obj.texte);
      $state.go('results');
    };
    $ionicModal.fromTemplateUrl('templates/modal.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.insField = function(field){
      $scope.obj.texte+=' $'+field+'$ ';
      $scope.modal.hide();
      console.log($scope.obj.texte);
    }
  })

.controller('contactsCtrl',function($scope,$ionicLoading,ContactService,$state,$cordovaContacts,$ionicPlatform){
    /*allContacts = [
      {
      displayName:"Philias",
      "name":{
        givenName:"Philias",
        formatted:"Philias"
      },
      nickname:"Wandji",
      phoneNumbers:[
        {
          id:"1",
          pref:"false",
          value:"695978619",
          type:"mobile"
        }]},
      {
        displayName:"a",
        "name":{
          givenName:"Philias",
          formatted:"Philias"
        },
        nickname:"Wandji",
        phoneNumbers:[{value:'695978619'}]}
    ];
    $scope.contacts=allContacts;*/
    /*$scope.fin=false;
    for(var i=0;i<allContacts.length;i++){
      $scope.actu=allContacts[i].displayName;
      console.log(i);
      console.log(allContacts[i]);
      if(allContacts[i].hasOwnProperty("phoneNumbers") ){  //We use only contacts which have at least one phone number
        if(allContacts[i]['phoneNumbers'].length>0){
          console.log("contact "+i+" is good");
          $scope.contacts.push(allContacts[i]);}
      }
    }
    console.log($scope.contacts);
    $scope.fin=true;*/
    $scope.hasPhoneNumber = function(contact){
        if(contact.phoneNumbers!=null){
          return true;
        }
        else{return false;}

    }
    var contacts = [];
    //$scope.fin="debut";
    $ionicPlatform.ready(function(){
      $scope.contacts = [];
      $ionicLoading.show({
        template:"Chargement de vos contacts ... "
      })
      $cordovaContacts.find({filter: '',multiple:true}).then(function (allContacts) { //omitting parameter to .find() causes all contacts to be returned
        //$scope.contacts = allContacts;
        allContacts.forEach(function(contact){
          $scope.actu=contact.displayName;
          if(contact.phoneNumbers!=null){
              $scope.contacts.push(contact);
          }
        })
        $ionicLoading.hide();
      },function(error){
        $ionicLoading.hide();
        alert('Error : '+error);
        console.log(error);
      })
    })

    $scope.suivant=function(){
      $scope.selectionnes=getSelected($scope.contacts);
      ContactService.getFieldsFromContact($scope.selectionnes[0]);
      ContactService.setPhone($scope.selectionnes,0);
      ContactService.setFinalContacts($scope.selectionnes);
      $state.go('message');
    }
  })

.controller('resultCtrl',function($scope,ContactService,MessageService,$state){
    $scope.contacts = ContactService.finalContacts;
    console.log($scope.contacts);
    var texte = MessageService.texte;
    MessageService.send($scope.contacts,ContactService,texte,0);
    $scope.restart = function(){
      $state.go('accueil');
    }
  })

.controller('accueilCtrl',function($scope,$state,ContactService){
      $scope.chooseFile = function(path){
        console.log("je suis ici");
        $state.go('selectfile');
      }
    $scope.selectContacts = function(){
      ContactService.setSource(0);
      $state.go('contacts');
    }
  })

.controller('selectFileCtrl',function($scope, $ionicPlatform, $fileFactory){

  var fs = new $fileFactory();

  $ionicPlatform.ready(function() {
    fs.getEntriesAtRoot().then(function(result) {
      $scope.files = result;
    }, function(error) {
      console.error(error);
    });

    $scope.getContents = function(path) {
      fs.getEntries(path).then(function(result) {
        $scope.files = result;
        $scope.files.unshift({name: "[parent]"});
        fs.getParentDirectory(path).then(function(result) {
          result.name = "[parent]";
          $scope.files[0] = result;
        });
      });
    }
  });

})
