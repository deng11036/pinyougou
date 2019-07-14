package com.pinyougou.sellergoods.service;

import com.pinyougou.pojo.TbBrand;
import com.pinyougou.entity.PageResult;

import java.util.List;
import java.util.Map;

public interface BrandService {
    /**
     * 查询所有品牌数据
     *
     * @return
     */
    public List<TbBrand> findAll();

    /**
     * f分页查询
     *
     * @param pageNum
     * @param pageSize
     * @return
     */
    public PageResult findPage(int pageNum, int pageSize);

    /**
     * 添加品牌
     *
     * @param tbBrand
     */
    public void add(TbBrand tbBrand);

    /**
     * 根据id查询
     *
     * @param id
     * @return
     */
    public TbBrand findOne(long id);

    /**
     * 修改品牌
     *
     * @param tbBrand
     */
    public void update(TbBrand tbBrand);

    /**
     * 删除
     *
     * @param ids
     */
    public void delete(long[] ids);

    /**
     * 模糊查询
     *
     * @param tbBrand
     * @param pageNum
     * @param pageSize
     * @return
     */
    public PageResult findPage(TbBrand tbBrand, int pageNum, int pageSize);

    public List<Map> selectOptionList();
}
