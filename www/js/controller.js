angular.module('cinstagram.controllers', [])

.controller('WelcomeCtrl', function($scope, $state, $ionicPopup, AuthService) {
    var promise = function () {
        AuthService.check()
            .then(function(res) {
                $state.go('app.home', {}, {reload: true});
            }, function(err) {
                others();
            });
    };
    promise();

    var others = function () {
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
    }
})

.controller('HomeCtrl', function($scope, $state, $ionicPopup, AuthService, PostService, LikeService) {
    var promise = function () {
        AuthService.check()
            .then(function(res) {
                AuthService.user = res.user;
                others();
            }, function(err) {
                $ionicPopup.alert({
                    title: 'Session Failed',
                    template: err.message
                });
                $state.go('welcome.signin', {}, {reload: true});
            });
    };
    promise();

    var others = function () {
        $scope.checkHome = function () {
            PostService.checkHome()
                .then(function(res) {
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
                    $scope.checkHome();
                }, function(err) {

                });
        };

        $scope.checkLike = function (post) {
            return LikeService.checkLike(post);
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

        $scope.checkHome();
    }
})

.controller('SearchCtrl', function($scope, $state, $ionicPopup, AuthService, PostService, LikeService, SearchService) {
    var promise = function () {
        AuthService.check()
            .then(function(res) {
                AuthService.user = res.user;
                others();
            }, function(err) {
                $ionicPopup.alert({
                    title: 'Session Failed',
                    template: err.message
                });
                $state.go('welcome.signin', {}, {reload: true});
            });
    };
    promise();

    var others = function () {
        $scope.checkDiscover = function () {
            PostService.checkDiscover()
                .then(function(res) {
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
                    $scope.checkDiscover();
                }, function(err) {

                });
        };

        $scope.checkLike = function (post) {
            return LikeService.checkLike(post);
        };

        $scope.comment = function(post) {
            PostService.comment(post._id, post.input)
                .then(function(res) {
                    $scope.checkDiscover();
                }, function(err) {
                    $ionicPopup.alert({
                        title: 'Comment Failed',
                        template: err.message
                    });
                });
        };

        $scope.search = {
            searchKey: ""
        };

        $scope.searchUser = function() {
            SearchService.searchUser($scope.search)
                .then(function(res) {
                    if (res.length === 0) {
                        $ionicPopup.alert({
                            title: 'Try again',
                            template: 'Nothing Found.'
                        });
                        return;
                    }
                    $scope.users = res;
                }, function(err) {
                    $ionicPopup.alert({
                        title: 'Search Failed',
                        template: err.message
                    });
                });
        };

        $scope.checkDiscover();
    }
})

.controller('CameraCtrl', function($scope, $state, $ionicPopup, AuthService, $cordovaCamera, $cordovaImagePicker, PostService) {
    var promise = function () {
        AuthService.check()
            .then(function(res) {
                AuthService.user = res.user;
                others();
            }, function(err) {
                $ionicPopup.alert({
                    title: 'Session Failed',
                    template: err.message
                });
                $state.go('welcome.signin', {}, {reload: true});
            });
    };
    promise();

    var others = function () {
        $scope.image = "";
        $scope.data = {};

        $scope.isShow = function() {
            if ($scope.image !== "") {
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
    }
})

.controller('ActivityCtrl', function($scope, $state, $ionicPopup, AuthService) {
    var promise = function () {
        AuthService.check()
            .then(function(res) {
                AuthService.user = res.user;
                others();
            }, function(err) {
                $ionicPopup.alert({
                    title: 'Session Failed',
                    template: err.message
                });
                $state.go('welcome.signin', {}, {reload: true});
            });
    };
    promise();

    var others = function () {
        
    }
})

.controller('ProfileCtrl', function($scope, $state, $stateParams, $ionicPopup, $cordovaCamera, $cordovaImagePicker, AuthService, PostService, ProfileService, FollowService, LikeService) {
    var promise = function () {
        AuthService.check()
            .then(function(res) {
                AuthService.user = res.user;
                others();
            }, function(err) {
                $ionicPopup.alert({
                    title: 'Session Failed',
                    template: err.message
                });
                $state.go('welcome.signin', {}, {reload: true});
            });
    };
    promise();

    var others = function () {
        var profile_id = $stateParams.id || AuthService.user._id;
        $scope.data_password = {
            password: "",
            oldPassword: ""
        };
        $scope.data_profile = {
            email: AuthService.user.email,
            username: AuthService.user.username
        };
        $scope.avatar = AuthService.user.avatar;

        $scope.isShow = function() {
            if ($scope.avatar !== "") {
                return true;
            }
            return false;
        };

        $scope.galery = function() {
            var options = {
                maximumImagesCount: 1,
                width: 0,
                height: 2000,
                quality: 80
            };

            $cordovaImagePicker.getPictures(options)
                .then(function(results) {
                    $scope.avatar = results[0];
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
                targetWidth: 200,
                targetHeight: 200,
                correctOrientation: true
            };

            $cordovaCamera.getPicture(options).then(function(imageURI) {
                $scope.avatar = imageURI;
            }, function(err) {
                $ionicPopup.alert({
                    title: 'Try again',
                    template: 'Image capture failed.'
                });
            });
        };

        $scope.updateAvatar = function() {
            ProfileService.updateAvatar($scope.avatar)
                .then(function(res) {
                    $ionicPopup.alert({
                        title: 'Success',
                        template: JSON.parse(res.response).message
                    });
                }, function(err) {
                    $ionicPopup.alert({
                        title: 'Try again',
                        template: 'Update avatar failed.'
                    });
                });
        };

        $scope.update = function (data) {
            ProfileService.update(data)
                .then(function(res) {
                    if (!!res.user) {
                        AuthService.user = res.user;
                    }
                    $ionicPopup.alert({
                        title: 'Success',
                        template: res.message
                    });
                }, function(err) {
                    $ionicPopup.alert({
                        title: 'Failed',
                        template: err.message
                    });
                });
        };

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

        if ($state.current.name === "app.discover-profile-followers"
            || $state.current.name === "app.discover-profile-followings") {
            $scope.prefix = "discover-";
        }

        if ($state.current.name === "app.home-profile") {
            $scope.prefix = "home-profile-";
        }

        if ($state.current.name === "app.discover-profile") {
            $scope.prefix = "discover-profile-";
        }

        $scope.checkProfile(profile_id);
        $scope.checkPost(profile_id);

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
    }
});
