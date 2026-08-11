package com.reservation.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Override
    public void sendAdminInvitation(
            String recipientEmail,
            String businessName,
            String invitationLink
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setFrom(senderEmail);
        message.setTo(recipientEmail);

        message.setSubject(
                "You're invited to manage " + businessName
        );

        message.setText(
                """
                Hello,

                You have been invited to become an ADMIN
                of %s on BookNauu.

                Please click the link below to accept
                the invitation and create your account:

                %s

                This invitation will expire in 2 days.

                If you did not expect this invitation,
                you can safely ignore this email.

                Regards,
                BookNauu
                """.formatted(
                        businessName,
                        invitationLink
                )
        );

        mailSender.send(message);
    }
}