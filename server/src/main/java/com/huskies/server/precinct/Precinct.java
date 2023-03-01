package com.huskies.server.precinct;

import com.huskies.server.district.District;

import com.huskies.server.mapConverter.MapConverter;
import jakarta.persistence.*;
import java.util.Map;

@Entity( name = "Precinct" )
@Table( name = "precincts" )
public class Precinct {
    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    private District district;

    @Convert(converter = MapConverter.class)
    @Column(name = "demographics") private Map<String, Integer> demographics;

    @Convert(converter = MapConverter.class)
    @Column(name = "votes") private Map<String, Integer> votes;

    public Precinct() {}

    public Precinct(String id) { this.id = id; }

    public Precinct(String id, District district) {
        this.id = id;
        this.district = district;
    }

    public Precinct(String id, District district, Map<String, Integer> demographics) {
        this.id = id;
        this.district = district;
        this.demographics = demographics;
    }

    public Precinct(String id, District district, Map<String, Integer> demographics, Map<String, Integer> votes) {
        this.id = id;
        this.district = district;
        this.demographics = demographics;
        this.votes = votes;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public District getDistrict() {
        return district;
    }

    public void setDistrict(District district) {
        this.district = district;
    }

    public Map<String, Integer> getDemographics() {
        return demographics;
    }

    public void setDemographics(Map<String, Integer> demographics) {
        this.demographics = demographics;
    }

    public Map<String, Integer> getVotes() {
        return votes;
    }

    public void setVotes(Map<String, Integer> votes) {
        this.votes = votes;
    }
}
