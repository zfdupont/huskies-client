package com.huskies.server.mapConverter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.util.Map;

@Converter(autoApply = true)
public class MapConverter implements AttributeConverter<Map<String, Integer>, String> {
    private ObjectMapper objectMapper = new ObjectMapper();
    @Override
    public String convertToDatabaseColumn(Map<String, Integer> precinctDemographics) {
        String precinctDemographicsJson = null;
        try {
            precinctDemographicsJson = objectMapper.writeValueAsString(precinctDemographics);
        } catch (final JsonProcessingException e){
            System.err.println(e);
        }
        return precinctDemographicsJson;
    }

    @Override
    public Map<String, Integer> convertToEntityAttribute(String precinctDemographicString) {
        Map<String, Integer> precinctDemographics = null;
        try{
            precinctDemographics = objectMapper.readValue(precinctDemographicString,
                    new TypeReference<Map<String, Integer>>() {
            });
        } catch (final JsonProcessingException e) {
            System.err.println(e);
        }
        return precinctDemographics;
    }
}
