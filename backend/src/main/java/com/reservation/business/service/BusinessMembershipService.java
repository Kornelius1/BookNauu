package com.reservation.business.service;

import com.reservation.business.entity.BusinessMembership;
import com.reservation.business.entity.BusinessRole;

public interface BusinessMembershipService {

    BusinessMembership getCurrentMembership();
    void requireOwner();
    void requireAdmin();
    void requireOwnerOrAdmin();
    boolean hasRole(BusinessRole role);
}