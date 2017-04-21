App.factory('factory', ($http, $location) => {
    // const apiUrl = 'http://locahost:8080/';

    let token = null;

    return {
        clientLogin: (user) => {
            return $http.post('http://localhost:8080/clientLogin', user);
        },

        companyLogin: (user) => {
            return $http.post('http://localhost:8080/companyLogin', user);
        },

        userViewAllPromotions: () => {
            return $http.get('http://localhost:8080/getAllPromotions');
        },

        clientUpdatePassword: (newPassword) => {
            return $http.post('http://localhost:8080/clientUpdatePassword', newPassword, {
                headers: {
                    'x-access-token': token,
                },
            });
        },

        companyUpdatePassword: (newPassword) => {
            return $http.post('http://localhost:8080/companyUpdatePassword', newPassword, {
                headers: {
                    'x-access-token': token,
                },
            });
        },

        //TODO adminUpdatePassword

        clienResetPassword: (data) => {
            return $http.post('http://localhost:8080/clienResetPassword', data, {
                headers: {
                    'x-access-token': token,
                },
            });
        },

        companyResetPassword: (data) => {
            return $http.post('http://localhost:8080/companyResetPassword', data, {
                headers: {
                    'x-access-token': token,
                },
            });
        },

        //TODO adminResetPassword


        setToken: (newToken) => {
            token = newToken;
        },

        getToken: () => {
            return token;
        },
    };
});
