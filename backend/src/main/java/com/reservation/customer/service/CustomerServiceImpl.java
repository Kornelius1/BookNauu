package com.reservation.customer.service;

import com.reservation.business.entity.Business;
import com.reservation.customer.dto.request.CustomerRequest;
import com.reservation.customer.entity.Customer;
import com.reservation.customer.mapper.CustomerMapper;
import com.reservation.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {


    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    @Override
    @Transactional
    public Customer findOrCreate(
            Business business,
            CustomerRequest request
    ) {

        return customerRepository
                .findByBusinessIdAndPhone(
                        business.getId(),
                        request.getPhone()
                )
                .orElseGet(() -> {

                    Customer customer =
                            customerMapper.toEntity(request);

                    customer.setBusiness(business);

                    return customerRepository.save(customer);
                });
    }


}
