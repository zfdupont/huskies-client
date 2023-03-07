package com.huskies.server.districtPlan;

import com.huskies.server.candidate.Candidate;
import com.huskies.server.candidate.CandidateRepository;
import com.huskies.server.candidate.CandidateService;
import com.huskies.server.district.District;
import com.huskies.server.district.DistrictRepository;
import com.huskies.server.precinct.Precinct;
import com.huskies.server.precinct.PrecinctRepository;
import com.huskies.server.precinct.PrecinctService;
import com.huskies.server.state.State;
import com.huskies.server.state.StateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DistrictPlanService {
    @Autowired DistrictPlanRepository districtPlanRepo;
    @Autowired DistrictRepository districtRepo;
    @Autowired PrecinctRepository precinctRepo;
    @Autowired
    StateRepository stateRepo;
    @Autowired
    PrecinctService precinctService;
    @Autowired
    CandidateService candidateService;


    public void addPrecinctToPlan(String planName, String candidateName, String precinctId, String districtId,
                                     int votes, char party){
        Candidate c;
        Precinct p;
        District d;
        DistrictPlan plan;

        // STINKY UGLY CODE
        // get candidate
        c = candidateService.upsertCandidate(candidateName, false, votes, party);

        p = precinctRepo.findById(precinctId).orElse(new Precinct(precinctId));
        precinctRepo.save(p);
        candidateService.addCandidateToPrecinct(precinctId, c.getId());
        d = districtRepo.findById(districtId).orElse(new District(districtId));
        districtRepo.save(d);

        d.addPrecinct(p); districtRepo.save(d);
        p.setDistrict(d); precinctRepo.save(p);

        plan = districtPlanRepo.findByName(planName).orElse(new DistrictPlan(planName));
        plan.getDistricts().add(d); districtPlanRepo.save(plan);
        d.setDistrictPlan(plan); districtRepo.save(d);
        if (plan.getState() == null) {
            State state = stateRepo.findById(precinctId.substring(0,2)).orElse(new State(precinctId.substring(0,2)));
            plan.setState(state);
            state.getPlans().add(plan);
            stateRepo.save(state);
        }
        districtPlanRepo.save(plan);
    }


}
