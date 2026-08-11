package com.reservation.business.service;

import com.reservation.auth.dto.response.UserResponse;
import com.reservation.business.dto.request.AcceptInvitationRequest;
import com.reservation.business.dto.request.InviteAdminRequest;

public interface BusinessInvitationService {

    void inviteAdmin(InviteAdminRequest request);

    UserResponse acceptInvitation(
            AcceptInvitationRequest request
    );
}