package com.qreal.robots.model.robot;

/**
 * Created by dageev on 28.03.15.
 */
public class RobotWrapper {
    private final Robot robot;
    private final RobotInfo robotInfo;
    private final String status;


    public RobotWrapper(Robot robot, RobotInfo robotInfo, String status) {
        this.robot = robot;
        this.robotInfo = robotInfo;
        this.status = status;
    }

    public RobotWrapper(Robot robot, String status) {
        this.robot = robot;
        this.status = status;
        this.robotInfo = null;

    }

    public RobotInfo getRobotInfo() {
        return robotInfo;
    }

    public Robot getRobot() {
        return robot;
    }

    public String getStatus() {
        return this.status;
    }
}
