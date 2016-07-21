
//var contacts = [];
angular.module('starter.controllers', [])

.controller('messageCtrl',function($scope,MessageService,ContactService){

    $scope.valider=function(texte){
      console.log("votre message : ");
      console.log(texte);
      var contact=ContactService.contacts[0];
      MessageService.sendOne(contact,ContactService,texte);
    };
  })

.controller('contactsCtrl',function($scope,ContactService){

    $scope.devList = [
      { text: "HTML5", checked: true },
      { text: "CSS3", checked: false },
      { text: "JavaScript", checked: false }
    ];

    $scope.pushNotificationChange = function() {
      console.log('Push Notification Change', $scope.pushNotification.checked);
    };

    $scope.pushNotification = { checked: true };
    $scope.emailNotification = 'Subscribed';
  })
