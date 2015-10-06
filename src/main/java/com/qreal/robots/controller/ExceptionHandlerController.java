package com.qreal.robots.controller;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * Created by vladzx on 23.06.15.
 */
@ControllerAdvice
public class ExceptionHandlerController {

    @ExceptionHandler(Exception.class)
    public String handleException(Exception e) {
        return "errors/404";
    }
}
