package com.qreal.robots.model.diagram;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Created by vladzx on 17.11.14.
 */
@Entity
@Table(name = "vertices")
public class LinkVertex implements Serializable {

    @Id
    @Column(name = "vertex_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vertexId;

    @Column(name = "x")
    private double x;

    @Column(name = "y")
    private double y;

    @Column(name = "number")
    private int number;

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

    public Long getVertexId() {
        return vertexId;
    }

    public void setVertexId(Long vertexId) {
        this.vertexId = vertexId;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }
}
