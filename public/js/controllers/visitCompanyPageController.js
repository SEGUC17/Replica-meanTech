//Company Profile for visitors/Clients
const visitCompanyPageController = function ($scope, $location, factory) {
    const comp = factory.getSelectedCompany();
    $scope.showReview = false;

    if (!factory.getToken()) {
        $scope.showReview = false;
    } else $scope.showReview = true;
    // function that redirects clients to a page to post reviews on the company
    $scope.reviewPage = function reviewPage(companyInfo) {
        factory.setCompanyReview(companyInfo);
        $location.path('/postReview');
    };
    // function that redirects anyone to view the reviews on the company
    $scope.viewReviews = function viewReviews(companyInfo) {
        factory.setCompanyReview(companyInfo);
        $location.path('/viewRatings');
    };
    // function that retrieves the information for the company profile
    factory.CompanyProfile(comp)
        .then(function (response) {
            const company = response.data.data;
            $scope.companyInfo = comp;
        })
        .catch(function (response) {
            alert(response.data.error);
        });
    //For clients to add companies to their list of favourites
    $scope.addToFavCompanies = function addToFavCompanies() {
        var compName = comp.name;

        factory.addFavCompanies(compName)
            .success(function (data) {
                alert("Company added to favourites");
            }).error(function (error) {
                alert("Cannot add company to favourites");
            });
    };
};

visitCompanyPageController.$inject = ['$scope', '$location', 'factory'];
App.controller('visitCompanyPageController', visitCompanyPageController);