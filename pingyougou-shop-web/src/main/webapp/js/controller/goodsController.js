//控制层
app.controller('goodsController', function ($scope, $controller,$location, goodsService, uploadService, itemCatService, typeTemplateService) {

    $controller('baseController', {$scope: $scope});//继承

    //读取列表数据绑定到表单中  
    $scope.findAll = function () {
        goodsService.findAll().success(
            function (response) {
                $scope.list = response;
            }
        );
    }

    //分页
    $scope.findPage = function (page, rows) {
        goodsService.findPage(page, rows).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    }

    //查询实体
    $scope.findOne = function () {
        var id =$location.search()['id'];
        if (id==null){
            return;
        }
        goodsService.findOne(id).success(
            function (response) {
                $scope.entity = response;
                editor.html($scope.entity.tbGoodsDesc.introduction);//商品描述
                $scope.entity.tbGoodsDesc.itemImages = JSON.parse($scope.entity.tbGoodsDesc.itemImages)//商品图片展示
                $scope.entity.tbGoodsDesc.customAttributeItems = JSON.parse($scope.entity.tbGoodsDesc.customAttributeItems)//扩展属性
                $scope.entity.tbGoodsDesc.specificationItems=JSON.parse( $scope.entity.tbGoodsDesc.specificationItems)//规格选项
                //规格转换
                for (var i=0;i<$scope.entity.itemList.length;i++){
                    $scope.entity.itemList[i].spec = JSON.parse($scope.entity.itemList[i].spec);
                }
            }
        );
    }

    //保存
    $scope.save = function () {
        $scope.entity.tbGoodsDesc.introduction = editor.html();
        if ($scope.entity.tbGoods.id!=null){
            goodsService.update($scope.entity).success(
                function (response) {
                    if (response.success) {
                        alert("修改成功")
                        $scope.entity = {};//清空 文本框数据
                        editor.html("");//清空富文本编辑器内容
                    } else {
                        alert(response.message);
                    }
                }
            );
        } else {
            goodsService.add($scope.entity).success(
                function (response) {
                    if (response.success) {
                        alert("保存成功")
                      location.href="goods.html";
                    } else {
                        alert(response.message);
                    }
                }
            );
        }
    }


    //保存
    $scope.add = function () {
        $scope.entity.tbGoodsDesc.introduction = editor.html();
        goodsService.add($scope.entity).success(
            function (response) {
                if (response.success) {
                    alert("保存成功")
                    $scope.entity = {};//清空 文本框数据
                    editor.html("");//清空富文本编辑器内容
                } else {
                    alert(response.message);
                }
            }
        );
    }


    //批量删除
    $scope.dele = function () {
        //获取选中的复选框
        goodsService.dele($scope.selectIds).success(
            function (response) {
                if (response.success) {
                    $scope.reloadList();//刷新列表
                    $scope.selectIds = [];
                }
            }
        );
    }

    $scope.searchEntity = {};//定义搜索对象

    //搜索
    $scope.search = function (page, rows) {
        goodsService.search(page, rows, $scope.searchEntity).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    }


    //上传文件
    $scope.uploadFile = function () {
        uploadService.uploadFile().success(
            function (response) {
                if (response.success) {
                    $scope.image_entity.url = response.message;
                } else {
                    alert("上传失败")
                }
            }
        )
    }

    //定义组合实体
    $scope.entity = {tbGoods: {}, tbGoodsDesc: {itemImages: [], specificationItems: []}}

    //添加图片到集合
    $scope.add_image_entity = function () {
        $scope.entity.tbGoodsDesc.itemImages.push($scope.image_entity);
    }


    //删除图片
    $scope.dele_image = function (index) {
        $scope.entity.tbGoodsDesc.itemImages.splice(index, 1);
    }


    //一级下拉
    $scope.selectItemCat1List = function () {
        itemCatService.findByParentId(0).success(
            function (response) {
                $scope.itemCat1List = response;
            }
        )
    }

    //二级下拉
    $scope.$watch("entity.tbGoods.category1Id", function (newValue, oldValue) {
        itemCatService.findByParentId(newValue).success(
            function (response) {
                $scope.itemCat2List = response;
            }
        )
    });

    //三级下拉
    $scope.$watch("entity.tbGoods.category2Id", function (newValue, oldValue) {
        itemCatService.findByParentId(newValue).success(
            function (response) {
                $scope.itemCat3List = response;
            }
        )
    });


    //三级选择后  得到模板id
    $scope.$watch("entity.tbGoods.category3Id", function (newValue, oldValue) {
        itemCatService.findOne(newValue).success(
            function (response) {
                $scope.entity.tbGoods.typeTemplateId = response.typeId;
            }
        )
    });


    //商品下拉
    $scope.$watch("entity.tbGoods.typeTemplateId", function (newValue, oldValue) {
        typeTemplateService.findOne(newValue).success(
            function (response) {
                $scope.tbTypeTemplate = response;
                $scope.tbTypeTemplate.brandIds = JSON.parse($scope.tbTypeTemplate.brandIds);
                if ($location.search()['id']==null){
                    $scope.entity.tbGoodsDesc.customAttributeItems = JSON.parse($scope.tbTypeTemplate.customAttributeItems);
                }
            }
        )

        //查询规格列表
        typeTemplateService.findSpecList(newValue).success(
            function (response) {
                $scope.specList = response;
            }
        )

    })


    $scope.updateSpecAttribute = function ($event, name, value) {
        //调用方法判断集合中是否对象
        var object = $scope.searchObjectByKey($scope.entity.tbGoodsDesc.specificationItems, "attributeName", name);
        if (object != null) {
            if ($event.target.checked) {//选中
                object.attributeValue.push(value)
            } else {//取消勾选  删除
                object.attributeValue.splice(object.attributeValue.indexOf(value), 1);

                if (object.attributeValue.length == 0) {//如 一个都不勾选
                    $scope.entity.tbGoodsDesc.specificationItems.splice(
                        $scope.entity.tbGoodsDesc.specificationItems.indexOf(object), 1
                    )
                }
            }
        } else {
            $scope.entity.tbGoodsDesc.specificationItems.push({"attributeName": name, "attributeValue": [value]});
        }
    }


    //创建sku列表方法
    $scope.createItemList = function () {
        //定义一个item模板------代表一行数据
        $scope.entity.itemList = [{spec: {}, price: 0, num: 5555, status: "0", isDefault: "0"}]
        //获取用户选中的规格集合------起别名items
        var items = $scope.entity.tbGoodsDesc.specificationItems;
        //遍历items得到每个  {"attributeName":"网络制式","attributeValue":["移动3G","移动4G"]}
        for (var i = 0; i < items.length; i++) {
            $scope.entity.itemList = addColumn( $scope.entity.itemList,items[i].attributeName,items[i].attributeValue);
        }
    }

    addColumn = function (list, column, columnValue) {
        var newList=[];
        for (var i = 0; i < list.length; i++) {
            var oldRow = list[i];//得到每一行数据
            for (var j = 0; j < columnValue.length; j++) {
                var newRow = JSON.parse(JSON.stringify(oldRow))//克隆给newRow
                newRow.spec[column]=columnValue[j];//给这行数据 加上一列值
                newList.push(newRow);
            }
        }
        return newList;
    }

    $scope.status=["未审核","已审核","审核已通过","关闭"];

    $scope.itemCatList=[];
    //查询商品分类列表
    $scope.findItemCastList=function () {
        itemCatService.findAll().success(
            function (response) {
                for (var i = 0 ;i<response.length;i++){
                    $scope.itemCatList[response[i].id]=response[i].name;
                }
            }
        )
    }




    //规格选项
    $scope.attributeValue=function (specName,optionName) {
        var items =$scope.entity.tbGoodsDesc.specificationItems;
        var obj = $scope.searchObjectByKey(items,"attributeName",specName);
        if (obj!=null){
            if (obj.attributeValue.indexOf(optionName)>=0){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * 上下架
     */
    $scope.updateIsMarketable=function (status) {
        goodsService.updateIsMarketable($scope.selectIds,status).success(
            function (response) {
                if (response.success) {
                    alert(response.message)
                    $scope.reloadList();
                    $scope.selectIds=[];
                }
            }
        )
    }


});
