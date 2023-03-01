package com.huskies.server.district;

import com.huskies.server.districtPlan.DistrictPlan;
import com.huskies.server.precinct.Precinct;
import com.huskies.server.state.State;

import jakarta.persistence.*;
import java.util.Set;

@Entity(name = "District")
@Table(name = "districts")
public class District {

    @Id private String id;
    @OneToMany(mappedBy = "district")
    private Set<Precinct> precincts;

    @ManyToOne
    private DistrictPlan districtPlan;

    @Column(name = "is_incumbent") private boolean isIncumbent;

    public District() {}

    public District(String id) {
        this.id = id;
    }

    public District(String id, Set<Precinct> precincts, boolean isIncumbent) {
        this.id = id;
        this.precincts = precincts;
        this.isIncumbent = isIncumbent;
    }

    public boolean isIncumbent() {
        return isIncumbent;
    }

    public void setIncumbent(boolean incumbent) {
        isIncumbent = incumbent;
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
}
