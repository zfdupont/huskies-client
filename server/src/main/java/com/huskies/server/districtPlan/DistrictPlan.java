package com.huskies.server.districtPlan;

import com.huskies.server.district.District;

import com.huskies.server.state.State;
import jakarta.persistence.*;
import java.util.Set;

@Entity(name = "DistrictPlan")
@Table(name = "district_plans")
public class DistrictPlan {
    @Id private String id;
    @OneToMany(mappedBy = "districtPlan")
    Set<District> districts;

    @ManyToOne(fetch = FetchType.LAZY)
    private State state;

    @Column(name = "name", unique = true) private String name;

    public DistrictPlan() {}

    public DistrictPlan(String id) {
        this.id = id;
    }

    public DistrictPlan(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public DistrictPlan(String id, Set<District> districts, String name) {
        this.id = id;
        this.districts = districts;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Set<District> getDistricts() {
        return districts;
    }

    public void setDistricts(Set<District> districts) {
        this.districts = districts;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }
}
