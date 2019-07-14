package com.pinyougou.page.service;

public interface ItemPageService {

    /**
     * 生成商品详细静态页
     * @param goodsId
     */
    public boolean genItemPageHtml(Long goodsId);

    /**
     * 删除商品详细页
     * @param
     * @return
     */
    public boolean delItemHtml(Long[] goodsId);
}
