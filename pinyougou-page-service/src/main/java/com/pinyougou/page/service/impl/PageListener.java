package com.pinyougou.page.service.impl;

import com.pinyougou.page.service.ItemPageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;

@Component("pageListener")
public class PageListener implements MessageListener {

    @Autowired
    private ItemPageService itemPageService;

    @Override
    public void onMessage(Message message) {
        TextMessage textMessage = (TextMessage)message;
        try {
            String id = textMessage.getText();
            System.out.println("监听到消息： "+id);
            itemPageService.genItemPageHtml(Long.parseLong(id));
            System.out.println("生成静态页面");
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
}
