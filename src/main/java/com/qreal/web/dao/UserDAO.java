package com.qreal.web.dao;

import com.qreal.web.model.auth.User;

/**
 * Created by vladzx on 22.06.15.
 */
public interface UserDAO {

    public void save(User user);

    public User findByUserName(String username);

    public boolean isUserExist(String username);
}
