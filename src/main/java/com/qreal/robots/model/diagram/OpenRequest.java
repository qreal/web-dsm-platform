package com.qreal.robots.model.diagram;

import java.io.Serializable;

/**
 * Created by vladzx on 09.11.14.
 */
public class OpenRequest implements Serializable {

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    private Long id;
}
