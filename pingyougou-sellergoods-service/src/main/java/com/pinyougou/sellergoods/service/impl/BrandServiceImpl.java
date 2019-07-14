package com.pinyougou.sellergoods.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.pinyougou.sellergoods.service.BrandService;
import com.pinyougou.mapper.TbBrandMapper;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.pojo.TbBrandExample;
import com.pinyougou.entity.PageResult;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;

//com.pinyougou.sellergoods.service.impl
@Service
public class BrandServiceImpl implements BrandService {

    @Autowired
    private TbBrandMapper tbBrandMapper;

    /**
     * 查询所有品牌
     * @return
     */
    @Override
    public List<TbBrand> findAll() {
        return tbBrandMapper.selectByExample(null);
    }

    /**
     * 分页查询
     * @param pageNum
     * @param pageSize
     * @return
     */
    @Override
    public PageResult findPage(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum,pageSize);//分页查询
        Page<TbBrand> page = (Page<TbBrand>) tbBrandMapper.selectByExample(null);//将结果分装入 分页的Page对象
        return new PageResult(page.getTotal(),page.getResult());
    }

    /**
     * 添加
     * @param tbBrand
     */
    @Override
    public void add(TbBrand tbBrand) {
        tbBrandMapper.insert(tbBrand);
    }

    /**
     * 根据id查询
     * @param id
     * @return
     */
    @Override
    public TbBrand findOne(long id) {
        return tbBrandMapper.selectByPrimaryKey(id);
    }

    /**
     * 修改品牌
     * @param tbBrand
     */
    @Override
    public void update(TbBrand tbBrand) {
        tbBrandMapper.updateByPrimaryKey(tbBrand);
    }

    /**
     * 删除
     * @param ids
     */
    @Override
    public void delete(long[] ids) {
        for (long id : ids) {
            tbBrandMapper.deleteByPrimaryKey(id);
        }
    }

    /**
     * 模糊查询
     * @param tbBrand
     * @param pageNum
     * @param pageSize
     * @return
     */
    @Override
    public PageResult findPage(TbBrand tbBrand, int pageNum, int pageSize) {

        PageHelper.startPage(pageNum,pageSize);

        TbBrandExample examle = new TbBrandExample();
       TbBrandExample.Criteria criteria = examle.createCriteria();

        if (tbBrand!=null){
                if (tbBrand.getName()!=null&&tbBrand.getName().length()>0){
                    criteria.andNameLike("%"+tbBrand.getName()+"%");
                }
                if (tbBrand.getFirstChar()!=null&&tbBrand.getFirstChar().length()>0){
                      criteria.andFirstCharEqualTo(tbBrand.getFirstChar());
                  }
        }

        Page<TbBrand> page = (Page<TbBrand>) tbBrandMapper.selectByExample(examle);
        return new PageResult(page.getTotal(),page.getResult());
    }

    @Override
    public List<Map> selectOptionList() {
        return tbBrandMapper.selectOptionList();
    }
}
