package com.reservation.business.repository;

import com.reservation.business.entity.BusinessMembership;
import com.reservation.auth.entity.User;
import com.reservation.business.entity.Business;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;



public interface BusinessMembershipRepository
        extends JpaRepository<BusinessMembership, Long> {

    Optional<BusinessMembership> findByUser(User user);

    Optional<BusinessMembership> findByUserId(Long userId);

    Optional<BusinessMembership> findByUserAndBusiness(
            User user,
            Business business
    );

    Optional<BusinessMembership> findByUserIdAndBusinessId(
            Long userId,
            Long businessId
    );

    List<BusinessMembership> findByBusiness(Business business);
}