angular.module('app.controllers', [])

.controller('loginCtrl', function($scope) {
  $scope.login = function(){

    var AuthRef = new Firebase("https://cumarsoasis.firebaseio.com/");
    $scope.logged = false;
    $scope.isloggedIn = false;
    if($scope.password == null){
      console.log("Enter a password");
      $scope.loginError = true;
      $scope.error_password = true;
    }
    AuthRef.authWithPassword({
      email      : $scope.email,
      password   : $scope.password
    }, function(error, authData) {
      if (error) {
        $scope.loginError = true;
        $scope.$digest();
        switch(error.code) {
          case "INVALID_EMAIL":
            $scope.error_user = false;
            $scope.error_password = false;
            $scope.error_email = true;
            $scope.$digest();
            console.log("Bad email");
            break;
          case "INVALID_PASSWORD":
            $scope.error_email = false;
            $scope.error_user = false;
            $scope.error_password = true;
            $scope.$digest();
            console.log("Bad password");
            break;
          case "INVALID_USER":
            $scope.error_email = false;
            $scope.error_password = false;
            $scope.error_user = true;
            $scope.$digest();
            console.log("Bad User");
            break;
          default:
            console.log("There was an error.")
        }

        // console.log('Cannot log in: ', error);
      }
      else {
        $scope.loginError = false;
        $scope.logged = true;
        $scope.isloggedIn = true;
        $scope.$digest();
        console.log("Successfully logged in user:" + authData.uid);
      }
    });
  };

  $scope.forgot = function(){
    var AuthRef = new Firebase("https://cumarsoasis.firebaseio.com/");
    AuthRef.resetPassword({
      email: $scope.email
    }, function(error){
      if(error){
        switch (error.code) {
          case "INVALID_USER":
            console.log("The specified user account does not exist.");
            break;
          default:
            console.log("Error resetting password:", error);
    }
      } else {
        console.log("Success!");
      }
    });
  };

})

.controller('registerCtrl', function($scope) {
  $scope.register = function() {
    var AuthRef = new Firebase("https://cumarsoasis.firebaseio.com/");
    if($scope.password === $scope.passwordConfirm){
      AuthRef.createUser({
        email: $scope.email,
        password: $scope.passwordConfirm
      }, function(error, authData){
        if(error){
          console.log("Account not Created",error);
          $scope.regError = true;
          $scope.$digest();
        }
        else{
          console.log("Account Created!");
          $scope.regError = false;
          $scope.registered = true;
          $scope.$digest();
        }
      });
    }
    else{
      console.log("passwords do not match");
      $scope.passMismatch = true;
      $scope.$digest();
    }

  };
})

.controller('tanksCtrl', function($scope, $http) {
  // XMLHttp Request to grab JSON file.
  var readings;
  $http({ method: 'GET', url: 'data/S305.json' }).then(function successCallback(response) {
      readings = response;
      console.log(readings.data);
      var date = new Date(readings.data[0][1] * 1000).getHours();
      // console.log(date.getHours());
      console.log(date);
      var chart = c3.generate({
        bindto: '#chart',
        point: { r: 0 },
        tooltip: { show: false },
        data: {
          columns: [
            readings.data[0],
            readings.data[1]
          ],
          x: readings.data[0][0], // epoch
          y: readings.data[1][0]  // CO2
        },
        axis: {
          x: {
            label: 'Date-Time',
            tick: { count: 5 }
          },
          y: {
            label: 'CO2'
          }
        },
        grid: {
          y: {
            lines: [
              { value: 0.0, text: 'Dangerous', axis: 'y', position: 'end' },
              { value: 0.1, text: 'Safe', axis: 'y', position: 'end' },
              { value: 0.2, text: 'Dangerous', axis: 'y', position: 'end' },
            ]
          }
        },
        regions: [
          // {axis: 'y', start: 0.3, end: 0.4, class: 'regionDangerous'},
          // {axis: 'y', start: 0.2, end: 0.3, class: 'regionSafe'},
          // {axis: 'y', start: 0, end: 0.1, class: 'regionDangerous'},
          {axis: 'y', start: 0.1, end: 0.2, class: 'regionSafe'}
        ]
      });
      chart.legend.hide();
    }, function errorCallback(response) {
      console.log("Error loading JSON data.")
    });
})

.controller('growthCtrl', function($scope) {

})

.controller('atmosphereCtrl', function($scope) {

})

.controller('settingsCtrl', function($scope) {

})
