package com.qreal.robots.service;

import com.qreal.robots.model.auth.User;

/**
 * Created by vladzx on 22.06.15.
 */
public interface UserService {

    public void save(User user);

    public User findByUserName(String username);

    public boolean isUserExist(String username);
}
