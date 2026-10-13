package com.example.services;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

// SQLite has no real date type, so dates are stored as ISO-8601 text.
// A fixed format (always with milliseconds, always UTC "Z") keeps text sorting == time sorting.
public final class DbTime {

    private static final DateTimeFormatter TIMESTAMP =
            DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").withZone(ZoneOffset.UTC);

    private DbTime() {
    }

    // Instant -> "2026-10-11T15:04:05.123Z"
    public static String format(Instant instant) {
        return instant == null ? null : TIMESTAMP.format(instant);
    }

    // "2026-10-11T15:04:05.123Z" -> Instant
    public static Instant parseInstant(String text) {
        return text == null || text.isBlank() ? null : Instant.parse(text);
    }

    // LocalDate -> "2026-10-11"
    public static String format(LocalDate date) {
        return date == null ? null : date.toString();
    }

    // "2026-10-11" -> LocalDate
    public static LocalDate parseDate(String text) {
        return text == null || text.isBlank() ? null : LocalDate.parse(text);
    }
}
