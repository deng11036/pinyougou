package com.pinyougou.page.service.impl;

import com.pinyougou.page.service.ItemPageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.jms.*;

@Component("pageDelListener")
public class PageDelListener implements MessageListener {

    @Autowired
    private ItemPageService itemPageService;

    @Override
    public void onMessage(Message message) {
        ObjectMessage objectMessage = (ObjectMessage)message;
        try {
            Long[] ids = (Long[]) objectMessage.getObject();
            System.out.println("监听到消息");
            itemPageService.delItemHtml(ids);
            System.out.println("删除静态页面");

        } catch (JMSException e) {
            e.printStackTrace();
        }

    }
}
