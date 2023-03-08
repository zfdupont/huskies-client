package com.huskies.server.districtPlan;

import com.huskies.server.FeatureCollectionPOJO;
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
import net.minidev.json.JSONObject;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.geotools.data.DataUtilities;
import org.geotools.data.FileDataStore;
import org.geotools.data.FileDataStoreFinder;
import org.geotools.data.collection.SpatialIndexFeatureCollection;
import org.geotools.data.simple.SimpleFeatureSource;
import org.geotools.feature.DefaultFeatureCollection;
import org.geotools.feature.FeatureCollection;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.URL;
import java.nio.file.*;
import java.util.*;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

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

    // Source: https://javapapers.com/java/glob-with-java-nio/
    private static List<String> match(String glob, Path location) throws IOException {


        List<String> list = new ArrayList<>();

        FileVisitor<Path> matcherVisitor = new SimpleFileVisitor<Path>() {
            @Override
            public FileVisitResult visitFile(Path file, BasicFileAttributes attribs) throws IOException {
                FileSystem fs = FileSystems.getDefault();
                PathMatcher matcher = fs.getPathMatcher(glob);
                if (matcher.matches(file.toAbsolutePath())) {
                    list.add(file.toAbsolutePath().toString());
                }
                return FileVisitResult.CONTINUE;
            }
        };
        Files.walkFileTree(location, matcherVisitor);
        return list;
    }

    private void createJsonFromShapefile(String shapefile, String out) throws IOException, InterruptedException {
        Path relativePath = Paths.get("");
        Path path = Path.of(relativePath.toAbsolutePath().getParent().toString() + "/scripts/shapefile_to_json.py");
        final String command = "python3 " + path;
        System.out.printf("Converting %s to json...%n", shapefile);
        assert path.toFile().exists();
        ProcessBuilder pb = new ProcessBuilder(command + String.format(" %s %s", shapefile, out));
        pb.redirectOutput(ProcessBuilder.Redirect.INHERIT);
        pb.redirectError(ProcessBuilder.Redirect.INHERIT);
        Process p = pb.start();
        p.wait();
        System.out.printf("Complete with status code %s%n", p.exitValue());
    }

    public Map<String, FeatureCollectionPOJO> loadPlansFromJson(){
        Path relativePath = Paths.get("");
        String fileGlob = "glob:**/*.zip";
        Path path = Path.of(relativePath.toAbsolutePath().getParent().toString() + "/data");
        Map<String, FeatureCollectionPOJO> map = new HashMap<>();
        try {
            List<String> files = match(fileGlob, path);
            List<File> shp_files = new ArrayList<>();
            files.removeIf(e -> !Pattern.matches(".*\\w{2}\\d{4}.*", e));
            Path tempDir = Path.of(relativePath.toAbsolutePath().toString() + "/tmp");
            new File(tempDir.toString()).mkdirs();
            for(String zip : files){
                // source: https://stackoverflow.com/questions/15667125/read-content-from-files-which-are-inside-zip-file
                ZipFile zipFile = new ZipFile(zip);
                Enumeration<? extends ZipEntry> entries = zipFile.entries();
                String filename = zip.replaceAll(".*/(.*).zip$", "$1");
                while(entries.hasMoreElements()){
                    ZipEntry entry = entries.nextElement();
                    //check for macosx folder
                    if(entry.getName().startsWith("__MACOSX")) continue;
                    InputStream stream = zipFile.getInputStream(entry);
                    String ext = entry.getName().replaceAll(".*?(.?.?.?.?)?$", "$1");
                    if(ext.charAt(0) != '.') continue;
                    File file = new File(String.format("%s/%s%s", tempDir, filename, ext)); file.deleteOnExit();
                    try(OutputStream outputStream = new FileOutputStream(file)){
                        IOUtils.copy(stream, outputStream);
                        if(ext.equals(".shp")) shp_files.add(file);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }
            }
            for(File file : shp_files){
                map.put(file.getName().replaceAll("(.?.?.?.?)?$", ""), new FeatureCollectionPOJO(loadShapefile(file)));
            }
            return map;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private FeatureCollection<SimpleFeatureType, SimpleFeature> loadShapefile(File file) throws IOException {
//        File file = new File("/Users/zfdupont/huskies-416-project/data/ny/2020/cong/ny_cong_2012_to_2021.shp");
        FileDataStore store = FileDataStoreFinder.getDataStore(file);
        // load shape file
        SimpleFeatureSource featureSource = store.getFeatureSource();
        SimpleFeatureSource cachedSource = DataUtilities.source(
                new SpatialIndexFeatureCollection(featureSource.getFeatures()));
        FeatureCollection<SimpleFeatureType, SimpleFeature> collection = cachedSource.getFeatures();
        return collection;
    }

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
