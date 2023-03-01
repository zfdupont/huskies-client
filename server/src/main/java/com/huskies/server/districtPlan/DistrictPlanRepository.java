package com.huskies.server.districtPlan;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DistrictPlanRepository extends CrudRepository<DistrictPlan, String> {}