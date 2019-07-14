package com.pinyougou.manager.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.sellergoods.service.BrandService;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.entity.PageResult;
import com.pinyougou.entity.Result;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/brand")
public class BrandController {

    @Reference
    private BrandService brandService;

    /**
     * 查询所有品牌
     * @return
     */
    @RequestMapping("/findAll")
    public List<TbBrand> findAll(){
       return brandService.findAll();
    }

    @RequestMapping("/findPage")
    public PageResult findPage(@RequestParam(name = "page",defaultValue = "1") int pageNum,
                               @RequestParam(name = "rows",defaultValue = "5") int pageSize){
        PageResult pageResult = brandService.findPage(pageNum, pageSize);
        return pageResult;
    }

    @RequestMapping("/add")
    public Result add(@RequestBody TbBrand tbBrand){
        try {
            brandService.add(tbBrand);
            return new Result(true,"增加成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false,"增加失败");
        }
    }

    @RequestMapping("/findOne")
    public TbBrand findOne(long id){
        return brandService.findOne(id);
    }

    @RequestMapping("/update")
    public Result update(@RequestBody TbBrand tbBrand){
        try {
            brandService.update(tbBrand);
            return new Result(true,"修改成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false,"修改失败");
        }
    }

    @RequestMapping("/delete")
    public Result delete(long[] ids){
        try {
            brandService.delete(ids);
            return new Result(true,"删除成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false,"删除失败");
        }
    }

    @RequestMapping("/serch")
    public PageResult serch(@RequestBody TbBrand tbBrand,int page ,int rows){
        PageResult pageResult = brandService.findPage(tbBrand, page, rows);
        return pageResult;
    }

    @RequestMapping("/selectOptionList")
    public  List<Map> selectOptionList(){
       return brandService.selectOptionList();
    }

}
