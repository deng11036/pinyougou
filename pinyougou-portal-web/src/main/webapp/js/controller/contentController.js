//广告控制层

app.controller('contentController', function ($scope, $location, contentService) {

    //跟分类id查询  广告集合
    $scope.contentList = [];

    $scope.findByCategoryId = function (categoryId) {
        contentService.findByCategoryId(categoryId).success(
            function (response) {
                $scope.contentList[categoryId] = response;
            }
        )
    }

    //搜索页对接
    $scope.search = function () {
        location.href="http://localhost:9104#?keywords="+$scope.keywords;
    }


});