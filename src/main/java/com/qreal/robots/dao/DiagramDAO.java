package com.qreal.robots.dao;

import com.qreal.robots.model.diagram.Diagram;
import com.qreal.robots.model.diagram.DiagramRequest;
import com.qreal.robots.model.diagram.Folder;

/**
 * Created by vladzx on 22.06.15.
 */
public interface DiagramDAO {

    public Long saveDiagram(DiagramRequest diagramRequest);

    public Diagram openDiagram(Long diagramId);

    public void rewriteDiagram(Diagram diagram);

    public Long createFolder(Folder folder);

    public Folder getFolderTree(String userName);
}
