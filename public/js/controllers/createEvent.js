const createEventController = function($scope, $location, factory) {
    if (!factory.getToken()) {
        $location.path('/');
    } else {
        $scope.eventForm = {};

        $scope.createEvent = function() {
            factory.createEvent($scope.eventForm)
                .success(function(data) {
                    alert("Event Successfully created!")

                }).error(function(error) {
                    alert(error.message)

                });
        };
    }
}

createEventController.$inject = ['$scope', '$location', 'factory'];
App.controller('createEventController', createEventController);
