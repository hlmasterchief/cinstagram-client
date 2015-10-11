angular.module('cinstagram.controllers', [])

.controller('WelcomeCtrl', function($scope, $state, $ionicPopup, AuthService) {
    $scope.user = {
        email: "",
        username: "",
        password: ""
    };

    $scope.signin = function() {
        AuthService.signin($scope.user)
            .then(function(res) {
                $state.go('app.home', {}, {reload: true});
            }, function(err) {
                $ionicPopup.alert({
                    title: 'Signin Failed',
                    template: err.message
                });
            });
    };

    $scope.signup = function() {
        AuthService.signup($scope.user)
            .then(function(res) {
                $state.go('app.home', {}, {reload: true});
            }, function(err) {
                $ionicPopup.alert({
                    title: 'Signup Failed',
                    template: err.message
                });
            });
    };
})

.controller('HomeCtrl', function($scope, $state, $ionicPopup, AuthService) {
    $scope.signout = function() {
        AuthService.signout()
            .then(function(res) {
                // console.log(AuthService.user);
                $state.go('welcome.signin', {}, {reload: true});
            }, function(err) {
                $ionicPopup.alert({
                    title: 'Signout Failed',
                    template: err.message
                });
            });
    };
})

.controller('SearchCtrl', function($scope) {

})

.controller('CameraCtrl', function($scope) {

})

.controller('ActivityCtrl', function($scope) {

})

.controller('ProfileCtrl', function($scope) {

});
