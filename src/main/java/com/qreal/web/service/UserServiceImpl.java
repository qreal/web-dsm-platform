package com.qreal.web.service;

import com.qreal.web.dao.UserDAO;
import com.qreal.web.model.auth.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

/**
 * Created by vladzx on 22.06.15.
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserDAO userDAO;

    @Transactional
    public void save(User user) {
        userDAO.save(user);
    }

    @Transactional
    public User findByUserName(String username) {
        return userDAO.findByUserName(username);
    }

    @Transactional
    public boolean isUserExist(String username) {
        return userDAO.isUserExist(username);
    }
}
