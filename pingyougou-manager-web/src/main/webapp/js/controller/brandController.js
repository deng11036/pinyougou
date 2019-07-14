//控制器
app.controller("brandController",function ($scope,brandService,$controller) {

$controller("baseController",{$scope:$scope})//继承

    $scope.findAll=function () {
        brandService.findAll().success(
            function (response) {
                $scope.list=response;
            });
    }

    $scope.findPage=function (page,rows) {
        brandService.findPage(page,rows).success(
            function (response) {
                $scope.list=response.rows//赋值分页查询结果
                $scope.paginationConf.totalItems=response.total//更新总记录数
            }
        )
    }


    $scope.save=function () {

        var object = null;
        if ($scope.entity.id!=null){
            object=brandService.update($scope.entity);
        }else {
            object=brandService.add($scope.entity);
        }

        object.success(
            function (response) {
                if (response.success){
                    //增加成功---再查询一次
                    $scope.reloadList()
                }else {
                    alert(response.message)
                }
            }
        );
    }


    $scope.findOne=function (id) {
        brandService.findOne(id).success(
            function (response) {
                $scope.entity=response;
            }
        )
    }



    //批量删除
    $scope.dele=function () {
        brandService.dele($scope.selectIds).success(
            function (response) {
                if (response.success){	//删除成功
                    $scope.reloadList();
                } else {//删除失败
                    alert(response.message)
                }
            }
        )
    }

    $scope.search=function (page,rows) {
        brandService.search(page,rows,$scope.searchEntiry).success(
            function (response) {
                $scope.list=response.rows//赋值分页查询结果
                $scope.paginationConf.totalItems=response.total//更新总记录数
            }
        )
    }

});