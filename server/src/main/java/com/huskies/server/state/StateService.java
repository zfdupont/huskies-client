package com.huskies.server.state;

import com.huskies.server.district.District;
import com.huskies.server.district.DistrictRepository;
import com.huskies.server.district.DistrictService;
import com.huskies.server.districtPlan.DistrictPlan;
import org.geotools.data.DataUtilities;
import org.geotools.data.FileDataStore;
import org.geotools.data.FileDataStoreFinder;
import org.geotools.data.collection.SpatialIndexFeatureCollection;
import org.geotools.data.simple.SimpleFeatureSource;
import org.geotools.feature.FeatureCollection;
import org.geotools.feature.FeatureIterator;
import org.geotools.feature.simple.SimpleFeatureTypeBuilder;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.script.*;
import javax.swing.*;
import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class StateService {
    @Autowired StateRepository stateRepo;
    @Autowired DistrictRepository districtRepo;
    @Autowired
    DistrictService districtService;

    public State getStateById(String id){
        return stateRepo.findById(id).orElseThrow();
    }

    public List<State> getAllStates(){
        List<State> states = new ArrayList<>();
        stateRepo.findAll().forEach(states::add);
        return states;
    }

    public void addDistrictPlan(State state, DistrictPlan plan){
        Set<DistrictPlan> plans = state.getPlans();
        plans.add(plan);
        plan.setState(state);
    }

    public void update(State state){
        stateRepo.save(state);
    }

//    public void upsertState(String id, String name);
}
