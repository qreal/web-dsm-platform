interface Model {
    getWorldModel() : WorldModel;
    getTimeline() : Timeline;
    getRobotModels() : RobotModel[];
    getSetting() : Settings;
    addRobotModel(robotModel: TwoDRobotModel): void;
}