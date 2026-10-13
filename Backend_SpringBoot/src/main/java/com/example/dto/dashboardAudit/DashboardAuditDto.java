package com.example.dto.dashboardAudit;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

// One status change of a dashboard (table "dashboard_audit")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardAuditDto {

    @JsonProperty("auditId")
    private Long auditId;

    @JsonProperty("dashboardId")
    private Long dashboardId;

/*    @JsonProperty("changedBy")
    private String changedBy;  */

    @JsonProperty("previousStatus")
    private String previousStatus;

    @JsonProperty("newStatus")
    private String newStatus;

    @JsonProperty("changeTimestamp")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    private ZonedDateTime changeTimestamp;
}
