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

    $scope.check = function () {
        AuthService.check()
            .then(function(res) {
                $state.go('app.home', {}, {reload: true});
            }, function(err) {

            });
    };

    $scope.check();
})

.controller('HomeCtrl', function($scope, $state, $ionicPopup, AuthService, PostService) {
    $scope.signout = function() {
        AuthService.signout()
            .then(function(res) {
                $state.go('welcome.signin', {}, {reload: true});
            }, function(err) {
                $ionicPopup.alert({
                    title: 'Signout Failed',
                    template: err.message
                });
            });
    };

    $scope.checkHome = function () {
        PostService.checkHome()
            .then(function(res) {
                $scope.posts = res.posts;
            }, function(err) {

            });
    };

    $scope.like = function (id) {
        PostService.like(id)
            .then(function(res) {
                console.log(res);
            }, function(err) {

            });
    };

    $scope.checkLike = function (id) {
        return PostService.checkLike(id);
    };

    $scope.check = function () {
        AuthService.check()
            .then(function(res) {

            }, function(err) {
                $ionicPopup.alert({
                    title: 'Token Failed',
                    template: err.message
                });
                $state.go('welcome.signin', {}, {reload: true});
            });
    };

    $scope.check();
    $scope.checkHome();
})

.controller('SearchCtrl', function($scope) {

})

.controller('CameraCtrl', function($scope) {

})

.controller('ActivityCtrl', function($scope) {

})

.controller('ProfileCtrl', function($scope) {

});
