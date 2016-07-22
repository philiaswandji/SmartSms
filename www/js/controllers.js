
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

.controller('messageCtrl',function($scope,MessageService,ContactService){

    $scope.valider=function(texte){
      console.log(contacts);
      var contact=ContactService.contacts[0];
      MessageService.sendOne(contact,ContactService,texte);
    };
  })

.controller('contactsCtrl',function($scope,ContactService,$state,$cordovaContacts,$ionicPlatform){

    $scope.contacts = [
      /*{ text: "HTML5"},
      { text: "CSS3"},
      { text: "JavaScript"}*/
    ];
    //$scope.devList = ContactService.getAllContactsFromPhone();
    var contacts = [];
    $ionicPlatform.ready(function(){
      $cordovaContacts.find({filter: '',multiple:true}).then(function (allContacts) { //omitting parameter to .find() causes all contacts to be returned
        $scope.contacts = allContacts;
        alert(JSON.stringify($scope.contacts));
      },function(error){
        alert('Error : '+error);
        console.log(error);
      })
      // return contacts;
    })

    $scope.suivant=function(){
      $scope.selectionnes=getSelected($scope.contacts);
      contacts = getSelected($scope.contacts);
      $state.go('message');
    }
  })
