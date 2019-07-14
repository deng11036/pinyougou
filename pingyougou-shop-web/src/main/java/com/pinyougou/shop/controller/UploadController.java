package com.pinyougou.shop.controller;

import com.pinyougou.entity.Result;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import util.FastDFSClient;

import java.io.IOException;

@RestController
public class UploadController {

    @Value("${FILE_SERVER_URL}")
    private String FILE_SERVER_URL ;

    @RequestMapping("/upload")
    public Result upload(MultipartFile file) throws IOException {

        String originalFilename = file.getOriginalFilename();

        //得到文件后缀名
        String extName = originalFilename.substring(originalFilename.indexOf(".") + 1);

        try {
            //2、创建一个 FastDFS 的客户端
            FastDFSClient fastDFSClient= new FastDFSClient("classpath:config/fdfs_client.conf");
//
//        //执行上传
            String path = fastDFSClient.uploadFile(file.getBytes(), extName);

            //4、拼接返回的 url 和 ip 地址，拼装成完整的 url

            String url = FILE_SERVER_URL + path;
            return new Result(true,url);

        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false,"上传失败");
        }
    }
}
