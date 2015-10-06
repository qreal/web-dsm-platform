package com.qreal.robots.dao;

import com.qreal.robots.model.robot.Robot;

/**
 * Created by vladzx on 22.06.15.
 */
public interface RobotDAO {

    public void save(Robot robot);

    public void delete(Robot robot);

    public Robot findByName(String robotName);

    public boolean isRobotExists(String robotName);
}
