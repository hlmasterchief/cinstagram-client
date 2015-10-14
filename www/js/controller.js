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
                console.log(AuthService.user);
                AuthService.user = res.user;
                console.log(AuthService.user);
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

.controller('HomeCtrl', function($scope, $state, $ionicPopup, AuthService, PostService, LikeService) {
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

    $scope.viewMore = function (post) {
        if (post.limit.post==-3) {
            post.limit.post = Infinity; 
        }
        else {
            post.limit.post = -3;
        }
    };

    $scope.checkHome = function () {
        PostService.checkHome()
            .then(function(res) {
                $scope.posts = res.posts;
            }, function(err) {

            });
    };

    $scope.like = function (id) {
        LikeService.like(id)
            .then(function(res) {
                $scope.checkHome();
            }, function(err) {

            });
    };

    $scope.checkLike = function (post) {
        return LikeService.checkLike(post);
    };

    $scope.input = {
        text: ""
    };

    $scope.comment = function(post) {
        PostService.comment(post._id, post.input)
            .then(function(res) {
                $scope.checkHome();
            }, function(err) {
                $ionicPopup.alert({
                    title: 'Comment Failed',
                    template: err.message
                });
            });
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

.controller('CameraCtrl', function($scope, $state, $ionicPopup, $cordovaCamera, $cordovaImagePicker, PostService) {
        $scope.image = "";
        $scope.data = {};

        $scope.isShow = function() {
            if ($scope.img !== "") {
                return true;
            }
            return false;
        };

        $scope.galery = function() {
            var options = {
                maximumImagesCount: 1,
                width: 1200,
                height: 0,
                quality: 80
            };

            $cordovaImagePicker.getPictures(options)
                .then(function(results) {
                    $scope.image = results[0];
                }, function(err) {
                    $ionicPopup.alert({
                        title: 'Try again',
                        template: 'Image pick failed.'
                    });
                });
        };

        $scope.camera = function() {
            var options = {
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                quality: 80,
                targetWidth: 1200,
                targetHeight: 1200,
                correctOrientation: true
            };

            $cordovaCamera.getPicture(options).then(function(imageURI) {
                $scope.image = imageURI;
            }, function(err) {
                $ionicPopup.alert({
                    title: 'Try again',
                    template: 'Image capture failed.'
                });
            });
        };

        $scope.post = function() {
            PostService.postPost($scope.image, $scope.data)
                .then(function(res) {
                    $state.go('app.home', {}, {reload: true});
                }, function(err) {
                    $ionicPopup.alert({
                        title: 'Try again',
                        template: 'Post failed.'
                    });
                });
        };
})

.controller('ActivityCtrl', function($scope) {

})

.controller('ProfileCtrl', function($scope, $state, $stateParams, $ionicPopup, AuthService, PostService, ProfileService, FollowService, LikeService) {
    var profile_id = $stateParams.id || AuthService.user._id;

    $scope.isMine = function(id) {
        if (id === AuthService.user._id) {
            return true;
        }
        return false;
    }

    $scope.isFollowing = function(profile) {
        if (profile) {
           return FollowService.checkFollow(profile); 
        }
        return false;
    }

    $scope.follow = function (id) {
        FollowService.follow(id)
            .then(function(res) {
                $scope.checkProfile(profile_id);
            }, function(err) {

            });
    };

    $scope.checkProfile = function (id) {
        ProfileService.checkProfile(id)
            .then(function(res) {
                $scope.profile = res.profile;
            }, function(err) {

            });
    };

    $scope.checkPost = function (id) {
        PostService.checkPost(id)
            .then(function(res) {
                $scope.refresh();
                $scope.posts = res.posts;
            }, function(err) {

            });
    };

    $scope.viewMore = function (post) {
        if (post.limit.post==-3) {
            post.limit.post = Infinity; 
        }
        else {
            post.limit.post = -3;
        }
    };

    $scope.like = function (id) {
        LikeService.like(id)
            .then(function(res) {
                $scope.checkPost(profile_id);
            }, function(err) {

            });
    };

    $scope.checkLike = function (post) {
        return LikeService.checkLike(post);
    };

    $scope.comment = function(post) {
        PostService.comment(post._id, post.input)
            .then(function(res) {
                $scope.checkPost(profile_id);
            }, function(err) {
                $ionicPopup.alert({
                    title: 'Comment Failed',
                    template: err.message
                });
            });
    };

    $scope.refresh = function () {

    };

    $scope.prefix = "profile-";

    if ($state.current.name === "app.home-profile-followers"
        || $state.current.name === "app.home-profile-followings") {
        $scope.prefix = "home-";
    }

    if ($state.current.name === "app.home-profile") {
        $scope.prefix = "home-profile-";
    }

    $scope.checkProfile(profile_id);
    $scope.checkPost(profile_id);
});
