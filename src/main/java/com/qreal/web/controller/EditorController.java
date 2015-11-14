package com.qreal.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created by vladzx on 25.10.14.
 */
@Controller
public class EditorController {

    @RequestMapping(value = "/editor", method = RequestMethod.GET)
    public ModelAndView index() {
        return new ModelAndView("editor/editor");
    }
}
