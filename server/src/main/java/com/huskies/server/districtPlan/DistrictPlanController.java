package com.huskies.server.districtPlan;

import com.huskies.server.precinct.PrecinctService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class DistrictPlanController {

    @Autowired DistrictPlanService districtPlanService;
    @Autowired PrecinctService precinctService;
    @PatchMapping (value = "/precinct", consumes = MediaType.ALL_VALUE)
    @ResponseBody
    public int patchPrecinct(@RequestBody Map<String, String> json){
        try {
            String planName = json.get("plan");
            String candidateName = json.get("candidate");
            String stateId = json.get("state");
            String districtId = stateId+json.get("district");
            String precinctId = districtId+json.get("precinct");
            char party = json.get("party").charAt(0);
            int votes = Integer.parseInt(json.get("votes"));
            districtPlanService.addPrecinctToPlan(planName, candidateName, precinctId, districtId,
                    votes, party);
            return 201;
        } catch (Exception ignore) {
            System.err.println(ignore);
            return 500;
        }
    }
    @PatchMapping (value = "/cvap", consumes = MediaType.ALL_VALUE)
    @ResponseBody
    public void patchCVAP(@RequestBody Map<String, String> json){
        String precinct = json.get("precinct");
        Map<String, Integer> req;
        int total = Integer.parseInt(json.getOrDefault("total", "0"));
        int white = Integer.parseInt(json.getOrDefault("white", "0"));
        int black = Integer.parseInt(json.getOrDefault("black", "0"));
        int asian = Integer.parseInt(json.getOrDefault("asian", "0"));
        int pacific = Integer.parseInt(json.getOrDefault("pacific", "0"));
        int latino = Integer.parseInt(json.getOrDefault("latino", "0"));
        int indian = Integer.parseInt(json.getOrDefault("native", "0"));

    }
}
