package com.reservation.customer.mapper;

import com.reservation.customer.dto.request.CustomerRequest;
import com.reservation.customer.entity.Customer;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {


    public Customer toEntity(CustomerRequest request) {

        if (request == null) {
            return null;
        }

        Customer customer = new Customer();

        customer.setFullName(request.getFullName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());

        return customer;
    }


}
