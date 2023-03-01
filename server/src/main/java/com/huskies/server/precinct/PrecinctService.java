package com.huskies.server.precinct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PrecinctService {
    @Autowired PrecinctRepository precinctRepo;

    public Precinct getPrecinctById(String id){
        return precinctRepo.findById(id).get();
    }

    public void update(Precinct precinct){
        precinctRepo.save(precinct);
    }
}
