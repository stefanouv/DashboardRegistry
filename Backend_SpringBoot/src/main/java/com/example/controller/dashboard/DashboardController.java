package com.example.controller.dashboard;

import com.example.dto.dashboard.DashboardDto;
import com.example.services.DashboardDao.DashboardDao;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// Errors are handled centrally in com.example.exception.GlobalExceptionHandler
// CORS is configured centrally in com.example.config.CorsConfig
@RestController
public class DashboardController {

    @Autowired
    private DashboardDao dashboardDao;

    // POST /submit
    @PostMapping("/submit")
    public ResponseEntity<DashboardDto> saveDashboard(@Valid @RequestBody DashboardDto dashboardDto) {
        return ResponseEntity.ok(dashboardDao.insertSaveData(dashboardDto));
    }

    // GET /getAllMainData
    @GetMapping("/getAllMainData")
    public ResponseEntity<List<DashboardDto>> getAllMainData() {
        return ResponseEntity.ok(dashboardDao.getAllMainData());
    }

    // PATCH /updateStatusById   body: { "id": 1, "currentStatus": "Accepted" }
    @PatchMapping("/updateStatusById")
    public ResponseEntity<DashboardDto> updateStatusById(@RequestBody Map<String, Object> body) {
        Object rawId = body.get("id");
        Object rawStatus = body.get("currentStatus");
//        String username = (String) body.get("username");

        if (rawId == null) {
            throw new IllegalArgumentException("Field 'id' is required");
        }
        Long id;
        try {
            id = Long.parseLong(rawId.toString());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Field 'id' must be a number");
        }

        if (!(rawStatus instanceof String newStatus) || newStatus.isBlank()) {
            throw new IllegalArgumentException("Field 'currentStatus' is required");
        }

        // Returns the updated record; throws 404 / 400 via GlobalExceptionHandler
        return ResponseEntity.ok(dashboardDao.updateStatusAndAudit(id, newStatus/*, username*/));
    }
}
