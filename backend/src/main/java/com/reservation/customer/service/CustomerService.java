package com.reservation.customer.service;

import com.reservation.business.entity.Business;
import com.reservation.customer.dto.request.CustomerRequest;
import com.reservation.customer.entity.Customer;

public interface CustomerService {


    Customer findOrCreate(
            Business business,
            CustomerRequest request
    );


}
