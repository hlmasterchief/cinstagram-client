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

    var check = function(data) {
        return $q(function(resolve, reject) {
            $http.get(URL.base + URL.authenticate)
                .success(function(res) {
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

    loadLocalToken();

    return {
        signin: signin,
        signup: signup,
        signout: signout,
        check: check,
        user: user
    };
})