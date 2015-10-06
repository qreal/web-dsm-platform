class ModelImpl implements Model {
    private worldModel : WorldModel;
    private timeline : Timeline;
    private settings : Settings;
    private robotModels : RobotModel[] = [];

    constructor() {
        var model = this;
        this.timeline = new TimelineImpl();
        model.worldModel = new WorldModelImpl();
    }

    getWorldModel() : WorldModel {
        return this.worldModel;
    }

    getTimeline() : Timeline {
        return this.timeline;
    }

    getRobotModels() : RobotModel[] {
        return this.robotModels;
    }

    getSetting() : Settings {
        return this.settings;
    }

    addRobotModel(robotModel: TwoDRobotModel): void {
        var model = this;
        $(document).ready(function() {
            var robot:RobotModel = new RobotModelImpl(model.worldModel, robotModel, new TwoDPosition(300, 300));
            model.robotModels.push(robot);
            model.timeline.addRobotModel(robot);
        });
    }
}