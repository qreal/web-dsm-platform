package com.qreal.web.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qreal.web.model.auth.User;
import com.qreal.web.service.UserService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;

/**
 * Created by dageev on 07.03.15.
 */

@Controller
public class MainController {

    public static final String HOST_NAME = "127.0.0.1";
    public static final int PORT = 9002;

    private static final Logger LOG = Logger.getLogger(MainController.class);

    private static final ObjectMapper mapper = new ObjectMapper();

    @Autowired
    private UserService userService;

    @RequestMapping("/")
    public ModelAndView home(HttpSession session) {
        User user = userService.findByUserName(getUserName());

        ModelAndView model = new ModelAndView();
        model.addObject("user", user);
        model.setViewName("index");
        return model;
    }

    private String getUserName() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

}