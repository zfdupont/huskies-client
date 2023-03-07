package com.huskies.server.districtPlan;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DistrictPlanRepository extends CrudRepository<DistrictPlan, String> {
    default Optional<DistrictPlan> findByName(String name){
        for (DistrictPlan districtPlan : findAll()) {
            if(name.equalsIgnoreCase(districtPlan.getName())) return Optional.of(districtPlan);
        }
        return Optional.empty();
    }
}