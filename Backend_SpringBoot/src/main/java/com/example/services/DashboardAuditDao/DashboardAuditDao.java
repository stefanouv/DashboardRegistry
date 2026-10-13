package com.example.services.DashboardAuditDao;

import com.example.dto.dashboardAudit.DashboardAuditDto;
import com.example.services.DbTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.util.List;

@Service
public class DashboardAuditDao {

    // Audit timestamps are returned in this time zone
    private static final ZoneId DISPLAY_ZONE = ZoneId.of("Europe/Athens");

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<DashboardAuditDto> auditMapper = (rs, rowNum) -> {
        DashboardAuditDto auditDto = new DashboardAuditDto();
        auditDto.setAuditId(rs.getLong("audit_id"));
        auditDto.setDashboardId(rs.getLong("dashboard_id"));
//        auditDto.setChangedBy(rs.getString("changed_by"));
        auditDto.setPreviousStatus(rs.getString("previous_status"));
        auditDto.setNewStatus(rs.getString("new_status"));
        Instant changedAt = DbTime.parseInstant(rs.getString("change_timestamp"));
        auditDto.setChangeTimestamp(changedAt != null ? changedAt.atZone(DISPLAY_ZONE) : null);
        return auditDto;
    };

    public List<DashboardAuditDto> getAllAuditData() {
        return jdbcTemplate.query("SELECT * FROM dashboard_audit ORDER BY change_timestamp DESC, audit_id DESC", auditMapper);
    }
}
