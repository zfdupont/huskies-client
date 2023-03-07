package com.huskies.server.district;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.huskies.server.districtPlan.DistrictPlan;
import com.huskies.server.precinct.Precinct;
import com.huskies.server.state.State;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity(name = "District")
@JsonIdentityInfo(generator= ObjectIdGenerators.PropertyGenerator.class, property="id")
@Table(name = "districts")
public class District {

    @Id private String id;
    @OneToMany(mappedBy = "district")
    private Set<Precinct> precincts;

    @ManyToOne(fetch = FetchType.LAZY)
    private DistrictPlan districtPlan;

    public District() {}

    public District(String id) {
        this.id = id;
        this.precincts = new HashSet<>();
    }

    public District(String id, Set<Precinct> precincts) {
        this.id = id;
        this.precincts = precincts;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Set<Precinct> getPrecincts() {
        return precincts;
    }

    public void setPrecincts(Set<Precinct> precincts) {
        this.precincts = precincts;
    }

    public void addPrecinct(Precinct precinct){
        this.precincts.add(precinct);
    }

    public DistrictPlan getDistrictPlan() {
        return districtPlan;
    }

    public void setDistrictPlan(DistrictPlan districtPlan) {
        this.districtPlan = districtPlan;
    }
}
