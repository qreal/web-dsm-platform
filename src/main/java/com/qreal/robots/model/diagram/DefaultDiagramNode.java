package com.qreal.robots.model.diagram;


import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

/**
 * Created by vladzx on 31.10.14.
 */
@Entity
@Table(name = "nodes")
public class DefaultDiagramNode implements Serializable {

    @Id
    @Column(name = "node_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long nodeId;

    @Column(name = "joint_object_id")
    private String jointObjectId;

    @Column(name = "type")
    private String type;

    @Column(name = "x")
    private double x;

    @Column(name = "y")
    private double y;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "node_id", referencedColumnName = "node_id")
    @OrderBy("position")
    private Set<Property> properties;

    public Long getNodeId() {
        return nodeId;
    }

    public void setNodeId(Long nodeId) {
        this.nodeId = nodeId;
    }

    public String getJointObjectId() {
        return jointObjectId;
    }

    public void setJointObjectId(String jointObjectId) {
        this.jointObjectId = jointObjectId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public Set<Property> getProperties() {
        return properties;
    }

    public void setProperties(Set<Property> properties) {
        this.properties = properties;
    }
}
