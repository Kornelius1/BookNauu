package com.reservation.integration.google.service;

import com.reservation.auth.entity.User;
import com.reservation.business.entity.Business;
import com.reservation.integration.google.entity.GoogleCalendarOAuthState;

public interface GoogleCalendarOAuthStateService {

    GoogleCalendarOAuthState create(
            Business business
    );

    GoogleCalendarOAuthState consume(
            String state
    );
}