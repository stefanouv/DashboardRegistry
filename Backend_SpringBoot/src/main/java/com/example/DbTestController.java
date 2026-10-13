package com.example;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import javax.sql.DataSource;
import java.sql.Connection;

@RestController
public class DbTestController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/db-test")
    public String testDbConnection() {
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(2)) { // timeout 2 δευτερόλεπτα
                return "Database connection is OK!";
            } else {
                return "Database connection failed!";
            }
        } catch (Exception e) {
            return "Error connecting to database: " + e.getMessage();
        }
    }
}