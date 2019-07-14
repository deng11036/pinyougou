
app.controller("indexController", function ($scope,loginService) {

    $scope.showLonginName=function () {
        loginService.loginName().success(
            function (resonse) {
                $scope.loginName=resonse.loginName;
            });

    }

})
