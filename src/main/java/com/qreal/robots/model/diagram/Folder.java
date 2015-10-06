package com.qreal.robots.model.diagram;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

/**
 * Created by korniluk13 on 09.07.2015.
 */

@Entity
@Table(name = "folders")
public class Folder implements Serializable {

    public Folder() {
    }

    public Folder(String folderName, String userName) {
        this.folderName = folderName;
        this.userName = userName;
    }

    @Id
    @Column(name = "folder_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long folderId;

    @Column(name = "folder_name")
    private String folderName;

    @Column(name = "username")
    private String userName;

    @Column(name = "folder_parent_id")
    private Long folderParentId;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "folder_parent_id", insertable = false, updatable = false)
    private List<Folder> childrenFolders;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "folder_id", referencedColumnName = "folder_id")
    private List<Diagram> diagrams;

    public void setFolderId(Long folderId) {
        this.folderId = folderId;
    }

    public Long getFolderId() {
        return this.folderId;
    }

    public void setFolderName(String name) {
        this.folderName = name;
    }

    public String getFolderName() {
        return this.folderName;
    }

    public Long getFolderParentId() {
        return this.folderParentId;
    }

    public void setChildrenFolders(List<Folder> folderParentId) {
        this.childrenFolders = folderParentId;
    }

    public List<Folder> getChildrenFolders() {
        return this.childrenFolders;
    }

    public void setDiagrams(List<Diagram> diagrams) {
        this.diagrams = diagrams;
    }

    public List<Diagram> getDiagrams() {
        return this.diagrams;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserName() {
        return this.userName;
    }
}
