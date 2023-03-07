package com.huskies.server.state;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.huskies.server.districtPlan.DistrictPlan;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity(name = "State")
@JsonIdentityInfo(generator= ObjectIdGenerators.PropertyGenerator.class, property="id")
@Table(name = "states")
public class State {
    @Id private String id;

    @OneToMany(mappedBy = "state", cascade = {CascadeType.ALL})
    private Set<DistrictPlan> plans;
    public State() {}

    public State(String id) {
        this.id = id;
        this.plans = new HashSet<>();
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public Set<DistrictPlan> getPlans() {
        return plans;
    }

    public void setPlans(Set<DistrictPlan> plans) {
        this.plans = plans;
    }
}