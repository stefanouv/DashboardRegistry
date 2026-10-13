package com.example.controller.dashboardAudit;

import com.example.dto.dashboardAudit.DashboardAuditDto;
import com.example.services.DashboardAuditDao.DashboardAuditDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// Errors are handled centrally in com.example.exception.GlobalExceptionHandler
// CORS is configured centrally in com.example.config.CorsConfig
@RestController
public class DashboardAuditController {
    @Autowired
    private DashboardAuditDao dashboardAuditDao;

    // GET /getAllAuditData
    @GetMapping("/getAllAuditData")
    public ResponseEntity<List<DashboardAuditDto>> getAllAuditData() {
        return ResponseEntity.ok(dashboardAuditDao.getAllAuditData());
    }
}
