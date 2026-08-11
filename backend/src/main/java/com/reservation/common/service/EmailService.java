package com.reservation.common.service;

public interface EmailService {

    void sendAdminInvitation(
            String recipientEmail,
            String businessName,
            String invitationLink
    );
}