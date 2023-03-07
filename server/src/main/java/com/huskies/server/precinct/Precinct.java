package com.huskies.server.precinct;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.huskies.server.candidate.Candidate;
import com.huskies.server.district.District;

import com.huskies.server.mapConverter.MapConverter;
import jakarta.persistence.*;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Entity( name = "Precinct" )
@JsonIdentityInfo(generator= ObjectIdGenerators.PropertyGenerator.class, property="id")
@Table( name = "precincts" )
public class Precinct {
    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    private District district;

    @Convert(converter = MapConverter.class)
    @Column(name = "demographics") private Map<String, Integer> demographics;

    @Column(name = "totalVotes") private int totalVotes;

    @JsonIgnore
    @ManyToMany
    @JoinTable(name = "precincts_candidates",
            joinColumns = @JoinColumn(name = "precinct_id"),
            inverseJoinColumns = @JoinColumn(name = "candidate_id"))
    private Set<Candidate> candidates;

    public Precinct() {}

    public Precinct(String id) {
        this.id = id;
        this.candidates = new HashSet<>();
        this.demographics = new HashMap<>();
    }

    public Precinct(String id, District district) {
        this.id = id;
        this.district = district;
        this.demographics = new HashMap<>();
        this.candidates = new HashSet<>();
    }

    public Precinct(String id, District district, Map<String, Integer> demographics) {
        this.id = id;
        this.district = district;
        this.demographics = demographics;
        this.candidates = new HashSet<>();
    }

    public Precinct(String id, District district, Map<String, Integer> demographics, Set<Candidate> candidates) {
        this.id = id;
        this.district = district;
        this.demographics = demographics;
        this.candidates = candidates;
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

    public Set<Candidate> getCandidates() {
        return candidates;
    }

    public void setCandidates(Set<Candidate> candidates) {
        this.candidates = candidates;
    }

    public int getTotalVotes() {
        return totalVotes;
    }

    public void setTotalVotes(int totalVotes) {
        this.totalVotes = totalVotes;
    }
}
