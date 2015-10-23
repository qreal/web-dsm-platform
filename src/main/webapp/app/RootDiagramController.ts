class RootDiagramController {

    constructor($scope) {
        $scope.$on("timeline", function(event, timeline) { $scope.$broadcast("interpret", timeline); });
    }

}