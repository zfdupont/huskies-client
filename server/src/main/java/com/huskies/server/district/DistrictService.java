package com.huskies.server.district;

import com.huskies.server.state.State;
import com.huskies.server.districtPlan.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DistrictService {
    @Autowired DistrictRepository districtRepo;
//    @Autowired

    public List<District> getAllDistricts(State state){
        List<District> districts = new ArrayList<>();
        districtRepo.findAll().forEach(d -> {
            if(d.getId().substring(0,3).equalsIgnoreCase(state.getId()))
                districts.add(d);
        });
        return districts;
    }



//    public List<District> getAllDistricts(DistrictPlan plan){
//        List<District> districts = new ArrayList<>();
//        districtRepo.findAll().forEach(d -> {
//            if(d.getId().substring(0,3).equalsIgnoreCase(plan.getId()))
//                districts.add(d);
//        });
//        return districts;
//    }


}
