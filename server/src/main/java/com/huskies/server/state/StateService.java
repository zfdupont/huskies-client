package com.huskies.server.state;

import com.huskies.server.districtPlan.DistrictPlan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
public class StateService {
    @Autowired StateRepository stateRepo;

    public State getStateById(String id){
        return stateRepo.findById(id).get();
    }

    public List<State> getAllStates(){
        List<State> states = new ArrayList<>();
        stateRepo.findAll().forEach(states::add);
        return states;
    }

    public void addDistrictPlan(State state, DistrictPlan plan){
        Set<DistrictPlan> plans = state.getPlans();
        plans.add(plan);
        plan.setStateId(state.getId());
    }

    public void update(State state){
        stateRepo.save(state);
    }
}
