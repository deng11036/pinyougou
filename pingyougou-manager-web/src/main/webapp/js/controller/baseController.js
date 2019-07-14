app.controller("baseController", function ($scope) {

    // 分页控制
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 10,
        itemsPerPage: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
            $scope.reloadList();
        }
    }

    //刷新列表
    $scope.reloadList = function () {
        $scope.search($scope.paginationConf.currentPage,
            $scope.paginationConf.itemsPerPage);
    }

    //定义id集合
    $scope.selectIds = [];
    //用户勾选复选框
    $scope.updateSelection = function ($event, id) {
        if ($event.target.checked) {//如果选中状态，将该id添加至集合
            $scope.selectIds.push(id);
        } else {
            var idx = $scope.selectIds.indexOf(id);//得到该值在集合中索引
            $scope.selectIds.splice(idx, 1);//从该索引开始删除，1个值
        }
    }

    $scope.searchEntiry = {};

    //json数组显示
    $scope.jsonToString = function (jsonString, key) {
        var json = JSON.parse(jsonString);//将后台字符串转json对象
        var value = "";
        for (var i = 0; i < json.length; i++) {//遍历json对象，得到个{}
            if (i > 0) {
                value += ","
            }
            value += json[i][key];//取出通过key取出值，从{}
        }
        return value;
    }

    //根据key 在集合中查找一个对象
    $scope.searchObjectByKey=function (list, key, keyValue) {

        for (var i = 0; i < list.length; i++) {
            if (list[i][key]==keyValue) {//根据key得到值  是否与  keyValue相同
                return list[i];
            }
        }
        return null;
    }


})