package com.campusconnect.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiPredictionController {
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.ai-url:http://localhost:8000}")
    private String aiUrl;
    
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'ADMIN')")
    @PostMapping("/predict")
    public ResponseEntity<?> predict(@RequestBody Map<String, Object> features) {
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    aiUrl + "/predict", features, Map.class);
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "AI service is unavailable", "details", ex.getMessage()));
        }
    }
}
