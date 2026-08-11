package com.reservation.customer.repository;

import com.reservation.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository
        extends JpaRepository<Customer, Long> {


    Optional<Customer> findByIdAndBusinessId(
            Long id,
            Long businessId
    );

    Optional<Customer> findByBusinessIdAndPhone(
            Long businessId,
            String phone
    );

}
