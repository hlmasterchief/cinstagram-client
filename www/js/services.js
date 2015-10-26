angular.module('cinstagram.services', ['ionic', 'cinstagram.constants'])

.factory('AuthService', function($q, $http, URL) {
    var LOCAL_TOKEN_KEY = 'CinstagramToken';
    var LOCAL_USER_KEY  = 'CinstagramUser';
    var user;

    var signin = function(data) {
        return $q(function(resolve, reject) {
            $http.post(URL.base + URL.authenticate, data)
                .success(function(res) {
                    storeLocalToken(res.token, JSON.stringify(res.user));
                    resolve(res);
                })

                .error(function(err) {
                    reject(err);
                });
        });
    };

    var signup = function(data) {
        return $q(function(resolve, reject) {
            $http.post(URL.base + URL.users, data)
                .success(function(res) {
                    storeLocalToken(res.token, JSON.stringify(res.user));
                    resolve(res);
                })

                .error(function(err) {
                    reject(err);
                });
        });
    };

    var signout = function(data) {
        return $q(function(resolve, reject) {
            $http.get(URL.base + URL.authenticate)
                .success(function(res) {
                    destroyLocalToken();
                    resolve(res);
                })

                .error(function(err) {
                    reject(err);
                });
        });
    };

    var check = function() {
        return $q(function(resolve, reject) {
            $http.get(URL.base + URL.authenticate)
                .success(function(res) {
                    reloadUser(JSON.stringify(res.user));
                    console.log(res.user);
                    resolve(res);
                })

                .error(function(err) {
                    destroyLocalToken();
                    reject(err);
                });
        });
    };

    var destroyLocalToken = function() {
        user = undefined;
        $http.defaults.headers.common['x-access-token'] = undefined;
        window.localStorage.removeItem(LOCAL_TOKEN_KEY);
        window.localStorage.removeItem(LOCAL_USER_KEY);
    };

    var loadLocalToken = function() {
        var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        var usr  = window.localStorage.getItem(LOCAL_USER_KEY);

        if (!!token) {
            useLocalToken(token, usr);
        }
    }

    var storeLocalToken = function(token, usr) {
        window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
        window.localStorage.setItem(LOCAL_USER_KEY, usr);
        useLocalToken(token, usr);
    };

    var useLocalToken = function(token, usr) {
        $http.defaults.headers.common['x-access-token'] = token;
        user = JSON.parse(usr);
    };

    var reloadUser = function(usr) {
        window.localStorage.setItem(LOCAL_USER_KEY, usr);
        user = JSON.parse(usr);
    };

    loadLocalToken();

    return {
        signin: signin,
        signup: signup,
        signout: signout,
        check: check,
        user: user
    };
})

.factory('SearchService', function($q, $http, URL) {
    var searchUser = function(data) {
        return $q(function(resolve, reject) {
            console.log(data);
            $http.post(URL.base + URL.users + "/search", data)
                .success(function(res) {
                    console.log(res);
                    resolve(res.users);
                })

                .error(function(err) {
                    reject(err);
                });
        });
    };

    return {
        searchUser: searchUser
    };
})

.factory('PostService', function($q, $http, URL, AuthService, $cordovaFileTransfer) {
    var posts;

    var checkHome = function() {
        return $q(function(resolve, reject) {
            $http.get(URL.base + URL.posts + '/feed')
                .success(function(res) {
                    posts = res.posts;
                    resolve(res);
                })

                .error(function(err) {
                    reject(err);
                });
        });
    };

    var checkDiscover = function() {
        return $q(function(resolve, reject) {
            $http.get(URL.base + URL.posts + '/all')
                .success(function(res) {
                    posts = res.posts;
                    resolve(res);
                })

                .error(function(err) {
                    reject(err);
                });
        });
    };

    var checkPost = function(id) {
        return $q(function(resolve, reject) {
            $http.get(URL.base + URL.users + '/' + id + '/' + URL.posts)
                .success(function(res) {
                    posts = res.posts;
                    resolve(res);
                })

                .error(function(err) {
                    reject(err);
                });
        });
    };

    var findPost = function(id) {
        for (var i = 0; i < posts.length; i++) {
            if (posts[i]['_id'] === id) {
                var post = posts[i];
            }
        }
        return post;
    }

    var comment = function(id, data) {
        return $q(function(resolve, reject) {
            $http.post(URL.base + URL.posts + "/" + id + URL.comments, data)
                .success(function(res) {
                    resolve(res);
                })

                .error(function(err) {
                    reject(err);
                });
        });
    };

    var postPost = function(image, data) {
        var options = {
            fileKey: 'image',
            params: data,
            headers: {
                "x-access-token": $http.defaults.headers.common['x-access-token']
            }
        };

        return $q(function(resolve, reject) {
            $cordovaFileTransfer.upload(encodeURI(URL.base + URL.posts), image, options, true)
                .then(function(res) {
                    resolve(res);
                }, function(err) {
                    reject(err);
                }, function(progress) {

                });
        });
    };

    return {
        checkHome: checkHome,
        checkDiscover: checkDiscover,
        checkPost: checkPost,
        postPost: postPost,
        comment: comment
    };
})

.factory('ProfileService', function($q, $http, URL, AuthService, $cordovaFileTransfer) {

    var checkProfile = function(id) {
        return $q(function(resolve, reject) {
            $http.get(URL.base + URL.users + '/' + id)
                .success(function(res) {
                    profile = res.profile;
                    resolve(res);
                })

                .error(function(err) {
                    reject(err);
                });
        });
    };

    var update = function(data) {
        return $q(function(resolve, reject) {
            $http.put(URL.base + URL.users, data)
                .success(function(res) {
                    resolve(res);
                })

                .error(function(err) {
                    reject(err);
                });
        });
    };

    var updateAvatar = function(avatar) {
        var options = {
            httpMethod: 'PUT',
            fileKey: 'avatar',
            headers: {
                "x-access-token": $http.defaults.headers.common['x-access-token']
            }
        };

        return $q(function(resolve, reject) {
            $cordovaFileTransfer.upload(encodeURI(URL.base + URL.users), avatar, options, true)
                .then(function(res) {
                    resolve(res);
                }, function(err) {
                    reject(err);
                }, function(progress) {

                });
        });
    };

    return {
        checkProfile: checkProfile,
        updateAvatar: updateAvatar,
        update: update
    };

})

.factory('FollowService', function($q, $http, URL, AuthService) {

    var follow = function(id) {
        return $q(function(resolve, reject) {
            $http.put(URL.base + URL.users + "/" + id + '/follow')
                .success(function(res) {
                    resolve(res);
                })

                .error(function(err) {
                    reject(err);
                });
        });
    };

    var checkFollow = function(profile) {
        for (var i = 0; i < profile.followers.length; i++) {
            if (profile.followers[i]._id === AuthService.user._id) {
                return true;
            }
            if (profile.followers[i] === AuthService.user._id) {
                return true;
            }
        }
        return false;
    }

    return {
        follow: follow,
        checkFollow: checkFollow
    };
})


.factory('LikeService', function($q, $http, URL, AuthService) {
    var like = function(id) {
        return $q(function(resolve, reject) {
            $http.put(URL.base + URL.posts + "/" + id + '/like')
                .success(function(res) {
                    resolve(res);
                })

                .error(function(err) {
                    reject(err);
                });
        });
    };

    var checkLike = function(post) {
        for (var i = 0; i < post['likes'].length; i++) {
            if (post.likes[i]._id === AuthService.user._id) {
                return true;
            }
        }
        return false;
    };

    var activities;
    var checkActivity = function() {
        return $q(function(resolve, reject) {
            $http.get(URL.base + URL.activity)
                .success(function(res) {
                    activities = res.activities;
                    resolve(res);
                })

                .error(function(err) {
                    reject(err);
                });
        });
    };

    var checkActivityYou = function() {
        return $q(function(resolve, reject) {
            $http.get(URL.base + URL.activity + '/you')
                .success(function(res) {
                    activities = res.activities;
                    resolve(res);
                })

                .error(function(err) {
                    reject(err);
                });
        });
    };

    return {
        like: like,
        checkLike: checkLike,
        checkActivity: checkActivity,
        checkActivityYou: checkActivityYou
    };
})
