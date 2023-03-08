package com.huskies.server.state;

import com.huskies.server.FeatureCollectionPOJO;
import com.huskies.server.districtPlan.DistrictPlan;
import com.huskies.server.districtPlan.DistrictPlanService;
import com.huskies.server.precinct.PrecinctService;
import org.geotools.feature.DefaultFeatureCollection;
import org.geotools.feature.FeatureCollection;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class StateController {
    @Autowired PrecinctService precinctService;
    @Autowired StateService stateService;
    @Autowired
    DistrictPlanService districtPlanService;

    @GetMapping(value="/hi")
    public String sayHi(){
        return "Hi";
    }

    @GetMapping(value="/states/{id}", produces = "application/json")
    public State getState(@PathVariable String id){
        // returns a single state
        State s = stateService.getStateById(id);
        return s;
    }

    @GetMapping(value="/states", produces = "application/json")
    public Map<String, FeatureCollectionPOJO> getAllStates(){
        // returns all plans for all states
        return districtPlanService.loadPlansFromJson();
    }


}
