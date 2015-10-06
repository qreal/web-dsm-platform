package com.qreal.robots.controller;

import com.qreal.robots.model.diagram.Diagram;
import com.qreal.robots.model.diagram.DiagramRequest;
import com.qreal.robots.model.diagram.Folder;
import com.qreal.robots.model.diagram.OpenRequest;
import com.qreal.robots.service.DiagramService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

/**
 * Created by vladzx on 22.06.15.
 */
@Controller
public class DiagramRepositoryController {

    @Autowired
    private DiagramService diagramService;

    @ResponseBody
    @RequestMapping(value = "/saveDiagram", method = RequestMethod.POST)
    public Long saveDiagram(@RequestBody DiagramRequest diagramRequest) {
        return diagramService.saveDiagram(diagramRequest);
    }

    @ResponseBody
    @RequestMapping(value = "/openDiagram", method = RequestMethod.POST)
    public Diagram openDiagram(@RequestBody OpenRequest request) {
        return diagramService.openDiagram(request.getId());
    }

    @ResponseBody
    @RequestMapping(value = "/updateDiagram", method = RequestMethod.POST)
    public void rewriteDiagram(@RequestBody Diagram diagram) {
        diagramService.rewriteDiagram(diagram);
    }

    @ResponseBody
    @RequestMapping(value = "/createFolder", method = RequestMethod.POST)
    public Long createFolder(@RequestBody Folder folder) {
        return diagramService.createFolder(folder);
    }

    @ResponseBody
    @RequestMapping(value = "/getFolderTree", method = RequestMethod.GET)
    public Folder getFolderTree() {
        return diagramService.getFolderTree();
    }
}