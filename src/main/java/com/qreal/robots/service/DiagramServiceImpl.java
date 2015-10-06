package com.qreal.robots.service;

import com.qreal.robots.dao.DiagramDAO;
import com.qreal.robots.model.diagram.Diagram;
import com.qreal.robots.model.diagram.DiagramRequest;
import com.qreal.robots.model.diagram.Folder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by vladzx on 22.06.15.
 */
@Service
public class DiagramServiceImpl implements DiagramService {

    @Autowired
    private DiagramDAO diagramDAO;

    @Transactional
    @Override
    public Long saveDiagram(DiagramRequest diagramRequest) {
        return diagramDAO.saveDiagram(diagramRequest);
    }

    @Transactional
    @Override
    public Diagram openDiagram(Long diagramId) {
        return diagramDAO.openDiagram(diagramId);
    }

    @Transactional
    @Override
    public void rewriteDiagram(Diagram diagram) {
        diagramDAO.rewriteDiagram(diagram);
    }

    @Transactional
    @Override
    public void createRootFolder(String userName) {
        Folder rootFolder = new Folder("root", userName);
        diagramDAO.createFolder(rootFolder);
    }

    @Transactional
    @Override
    public Long createFolder(Folder folder) {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        folder.setUserName(userName);

        return diagramDAO.createFolder(folder);
    }

    @Transactional
    @Override
    public Folder getFolderTree() {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        return diagramDAO.getFolderTree(userName);
    }
}