
//搜索控制
app.controller("searchController",function ($scope,$location,searchService) {

    $scope.search=function () {
        $scope.searchMap.pageOn=parseInt( $scope.searchMap.pageOn);
        searchService.search($scope.searchMap).success(
            function (response) {
                $scope.resultMap=response;
                buildPageLabel();
            }
        );
    }


    //定义查询变量
    $scope.searchMap={keywords:"",category:"",brand:"",price:"",pageOn:1,pageSize:40,sort:"",sortField:"",spec:{}};

    //绑定变量方法
    $scope.addSearchItem=function (key,value) {
        if (key=="category"||key=="brand"||key=="price") {//如果用户点击 分类或品牌
            $scope.searchMap[key]=value;
        }else {//点击 规格
            $scope.searchMap.spec[key]=value;
        }
        $scope.search();//查询刷新
    }

    //撤销绑定
    $scope.removeSearchItem=function (key) {
        if (key=="category"||key=="brand"||key=="price") {//如果用户点击 分类或品牌
            $scope.searchMap[key] = '';
        } else {//点击 规格
            delete $scope.searchMap.spec[key];
        }
        $scope.search();//查询刷新
    }

    //分页栏
    buildPageLabel=function () {
        $scope.pageLabel=[];

        var beginPage=1;//开始页
        var lastPage=$scope.resultMap.totalPages;//结束页

        $scope.firstDot=true;//前5页显示。。。
        $scope.lastDot=true;//后5页显示。。。

        if ($scope.resultMap.totalPages>5){//如果总页数大于5页，显示部分分页
            if ($scope.searchMap.pageOn<=3){
                lastPage=5;
                $scope.firstDot=false;//不显示。。。
            }else if ($scope.searchMap.pageOn>=$scope.resultMap.totalPages-2){
                beginPage=$scope.resultMap.totalPages-4;
                $scope.lastDot=false;//不显示。。。
            } else {
                beginPage=$scope.searchMap.pageOn-2;
                lastPage=$scope.searchMap.pageOn+2;
            }
        }else {
            //总页数小于等于5页----。。。都不显示
            $scope.firstDot=false;
            $scope.lastDot=false;
        }

        for (var i =beginPage; i<=lastPage;i++){
            $scope.pageLabel.push(i);
        }
    }

    //提交页码查询
    $scope.queryByPage=function (pageOn) {
        //页码验证
        if (pageOn < 1 || pageOn >$scope.resultMap.totalPages) {
            return;
        }
        $scope.searchMap.pageOn=pageOn;//绑定页码
        $scope.search();//查询
    }

    //页码不可用设置
    $scope.isTopPage=function () {//是否是第一页
        if ($scope.searchMap.pageOn==1){
            return true;
        } else {
            return false;
        }
    }
    $scope.isEndPage=function () {//是否是最后一页
        if ($scope.searchMap.pageOn==$scope.resultMap.totalPages){
            return true;
        } else {
            return false;
        }
    }

    //排序查询
    $scope.searchSort=function (sort,sortField) {
        $scope.searchMap.sort=sort;
        $scope.searchMap.sortField=sortField;
        $scope.search();
    }


    //判断搜索关键字
    $scope.keywordsIsBrand=function () {
        for (var i = 0; i<$scope.resultMap.brandList.length;i++){
            if ($scope.searchMap.keywords.indexOf($scope.resultMap.brandList[i].text)>0){//关键字 包含 品牌
                return true;
            }
        }
        return false;
    }

    //对接首页---加载查询字符
    $scope.loadKeywords=function () {
        $scope.searchMap.keywords=$location.search()["keywords"];
        $scope.search();
    }


});