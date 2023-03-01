package com.huskies.server.precinct;

import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository;

@Repository
public interface PrecinctRepository extends CrudRepository<Precinct, String> {
}
