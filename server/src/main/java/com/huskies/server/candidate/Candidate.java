package com.huskies.server.candidate;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.huskies.server.precinct.Precinct;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;


@Entity(name="Candidate")
@JsonIdentityInfo(generator= ObjectIdGenerators.PropertyGenerator.class, property="id")
@Table(name="candidates")
public class Candidate {

    @Id @GeneratedValue private long id;
    @Column(name = "name") private String name;
    @Column(name = "votes") private int votes;
    @Column(name = "party") private char party;
    @Column(name = "incumbent") private boolean incumbent;
    @JsonIgnore
    @ManyToMany(mappedBy = "candidates")
    private Set<Precinct> precinct;
    public Candidate() {
    }

    public Candidate(long id) {
        this.id = id;
        this.precinct = new HashSet<>();
    }

    public Candidate(String name, char party) {
        this.name = name;
        this.party = party;
        this.precinct = new HashSet<>();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getVotes() {
        return votes;
    }

    public void setVotes(int votes) {
        this.votes = votes;
    }

    public char getParty() {
        return party;
    }

    public void setParty(char party) {
        this.party = party;
    }

    public Set<Precinct> getPrecinct() {
        return precinct;
    }

    public void setPrecinct(Set<Precinct> precinct) {
        this.precinct = precinct;
    }

    public boolean isIncumbent() {
        return incumbent;
    }

    public void setIncumbent(boolean incumbent) {
        this.incumbent = incumbent;
    }
}
