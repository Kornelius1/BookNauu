package com.reservation.business.service;

import com.reservation.auth.entity.User;
import com.reservation.business.entity.Business;
import com.reservation.business.entity.BusinessMembership;

public interface BusinessContextService {

    Business getCurrentBusiness();

    User getCurrentUser();

    Long getCurrentBusinessId();

    BusinessMembership getCurrentMembership();
}