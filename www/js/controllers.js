
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

.controller('messageCtrl',function($scope,MessageService,$state){

    $scope.showSpinner = false;
    $scope.valider=function(texte){
      MessageService.setText(texte);
      $state.go('results');
    };
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
    var contacts = [];
    //$scope.fin="debut";
    $ionicPlatform.ready(function(){
      $scope.contacts = [];
      $ionicLoading.show({
        template:"Chargement de vos contacts ... "
      })
      $cordovaContacts.find({filter: '',multiple:true}).then(function (allContacts) { //omitting parameter to .find() causes all contacts to be returned
        $scope.contacts = allContacts;
        $ionicLoading.hide();
        $scope.taille=allContacts.length;
        $scope.ind=0;
        var i=0;
        /*allContacts.forEach(function(contact){
          $scope.actu=contact.displayName;
          if(contact.hasOwnProperty("phoneNumbers") ){  //We use only contacts which have at least one phone number
            if(contact['phoneNumbers'].length>0){
              $scope.contacts.push(contact);
            }
          }else{}
        })*/
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

.controller('resultCtrl',function($scope,ContactService,MessageService){
    $scope.contacts = ContactService.finalContacts;
    console.log($scope.contacts);
    var texte = MessageService.texte;
    /*$scope.contacts = [
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
            value:"555-4",
            type:"mobile"
          }]},{
        displayName:"a",
        "name":{
          givenName:"Philias",
          formatted:"Philias"
        },
        nickname:"Wandji",
        phoneNumbers:[]}



    ];*/
    MessageService.send($scope.contacts,ContactService,texte,0);
  })
