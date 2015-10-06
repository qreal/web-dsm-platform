package com.qreal.robots.dao;

import com.qreal.robots.model.auth.User;
import com.qreal.robots.model.robot.Robot;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by dageev on 07.03.15.
 */

@Transactional
@Repository
public class RobotDAOImpl implements RobotDAO {

    @Autowired
    private SessionFactory sessionFactory;

    public RobotDAOImpl() {

    }

    public RobotDAOImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public void save(Robot robot) {
        Session session = sessionFactory.getCurrentSession();
        session.save(robot);
    }

    public void delete(Robot robot) {
        Session session = sessionFactory.getCurrentSession();
        session.delete(robot);
    }

    public Robot findByName(String robotName) {

        Session session = sessionFactory.getCurrentSession();

        List<Robot> robots = session.createQuery("from Robot where name=?").setParameter(0, robotName).list();
        if (robots.size() > 0) {
            return robots.get(0);
        } else {
            return null;
        }
    }

    public boolean isRobotExists(String robotName) {
        Session session = sessionFactory.getCurrentSession();

        List<User> robots = session.createQuery("from Robot where name=?").setParameter(0, robotName).list();
        return robots.size() > 0;

    }

}
