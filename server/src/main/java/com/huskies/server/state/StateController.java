package com.huskies.server.state;

import com.huskies.server.precinct.PrecinctService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.io.IOException;
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
    public @ResponseBody List<String> getState() throws IOException {
        List<String> geojsons = new ArrayList<>();
        Path filePath1 = Path.of("src/main/java/com/huskies/server/state/data/GA.json");
        String geojson1 = new String(Files.readAllBytes(filePath1));
        geojsons.add(geojson1);

        Path filePath2 = Path.of("src/main/java/com/huskies/server/state/data/NY.json");
        String geojson2 = new String(Files.readAllBytes(filePath2));
        geojsons.add(geojson2);

        Path filePath3 = Path.of("src/main/java/com/huskies/server/state/data/IL.json");
        String geojson3 = new String(Files.readAllBytes(filePath3));
        geojsons.add(geojson3);
        return geojsons;
    }


}
