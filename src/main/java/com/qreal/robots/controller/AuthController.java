package com.qreal.robots.controller;

import com.qreal.robots.dao.UserDAO;
import com.qreal.robots.model.auth.User;
import com.qreal.robots.service.DiagramService;
import com.qreal.robots.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * Created by dageev on 04.03.15.
 */

@Controller
public class AuthController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    @Autowired
    private DiagramService diagramService;

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public ModelAndView login(@RequestParam(value = "error", required = false) String error) {

        ModelAndView model = new ModelAndView();

        if (error != null) {
            model.addObject("error", "Invalid login or password");
        }
        model.setViewName("auth/login");

        return model;
    }

    @RequestMapping(value = "/register", method = RequestMethod.GET)
    public ModelAndView register() {
        ModelAndView model = new ModelAndView();
        model.setViewName("auth/register");
        return model;
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ModelAndView register(@RequestParam(value = "username") String username,
                                 @RequestParam(value = "password") String password,
                                 @RequestParam(value = "password2") String password2,
                                 RedirectAttributes redirectAttributes) {
        ModelAndView model = new ModelAndView();
        if (userService.isUserExist(username)) {
            return registerError(model, String.format("User with %s name is already exist", username));
        }

        if (!password.equals(password2)) {
            return registerError(model, String.format("Passwords are not equals"));
        }

        User user = new User(username, passwordEncoder.encode(password), true);
        userService.save(user);
        diagramService.createRootFolder(username);
        redirectAttributes.addFlashAttribute("msg", "Registered successfully. Log in to continue working");
        model.setViewName("redirect:/login");
        return model;
    }

    private ModelAndView registerError(ModelAndView modelAndView, String message) {
        modelAndView.addObject("error", message);
        modelAndView.setViewName("auth/register");
        return modelAndView;
    }
}
