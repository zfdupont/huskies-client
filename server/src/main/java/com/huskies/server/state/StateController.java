package com.huskies.server.state;

import com.huskies.server.precinct.PrecinctService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class StateController {
    @Autowired PrecinctService precinctService;
    @Autowired StateService stateService;

    @GetMapping(value="/hi")
    public String sayHi(){
        return "Hi";
    }

    @GetMapping(value="/states/{id}", produces = "application/json")
    public State getState(@PathVariable String id){
        // returns a single state
        System.out.println(id);
        return stateService.getStateById(id);
    }

    @GetMapping(value="/states", produces = "application/json")
    public State getState(){
        // returns all states
        return null;
    }


}
