package com.huskies.server.state;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class StateController {

    @GetMapping(value="/states/{id}", produces = "application/json")
    public State getState(@PathVariable String id){
        // returns a single state
        return null;
    }

    @GetMapping(value="/states", produces = "application/json")
    public State getState(){
        // returns all states
        return null;
    }
}
