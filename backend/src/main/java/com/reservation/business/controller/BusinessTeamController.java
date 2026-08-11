package com.reservation.business.controller;

import com.reservation.business.dto.response.TeamMemberResponse;
import com.reservation.business.service.BusinessTeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/business/team")
@RequiredArgsConstructor
public class BusinessTeamController {

    private final BusinessTeamService businessTeamService;

    @GetMapping
    public ResponseEntity<List<TeamMemberResponse>> getTeamMembers() {

        return ResponseEntity.ok(
                businessTeamService.getTeamMembers()
        );
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable Long userId
    ) {

        businessTeamService.removeMember(userId);

        return ResponseEntity.noContent().build();
    }
}