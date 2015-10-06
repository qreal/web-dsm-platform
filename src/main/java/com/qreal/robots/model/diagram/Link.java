package com.qreal.robots.model.diagram;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

/**
 * Created by vladzx on 31.10.14.
 */
@Entity
@Table(name = "links")
public class Link implements Serializable {

    @Id
    @Column(name = "link_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long linkId;

    @Column(name = "joint_object_id")
    private String jointObjectId;

    @Column(name = "source")
    private String source;

    @Column(name = "target")
    private String target;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "link_id", referencedColumnName = "link_id")
    @OrderBy("number")
    private Set<LinkVertex> vertices;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "link_id", referencedColumnName = "link_id")
    @OrderBy("position")
    private Set<Property> properties;

    public Long getLinkId() {
        return linkId;
    }

    public void setLinkId(Long linkId) {
        this.linkId = linkId;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public Set<LinkVertex> getVertices() {
        return vertices;
    }

    public void setVertices(Set<LinkVertex> vertices) {
        this.vertices = vertices;
    }

    public String getJointObjectId() {
        return jointObjectId;
    }

    public void setJointObjectId(String jointObjectId) {
        this.jointObjectId = jointObjectId;
    }

    public Set<Property> getProperties() {
        return properties;
    }

    public void setProperties(Set<Property> properties) {
        this.properties = properties;
    }
}
