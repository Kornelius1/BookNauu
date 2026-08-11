package com.reservation.business.repository;

import com.reservation.business.entity.BusinessInvitation;
import com.reservation.business.entity.BusinessInvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BusinessInvitationRepository
        extends JpaRepository<BusinessInvitation, Long> {

    Optional<BusinessInvitation> findByToken(String token);

    boolean existsByBusinessIdAndEmailAndStatus(
            Long businessId,
            String email,
            BusinessInvitationStatus status
    );
}