package com.shop.back.cart.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shop.back.cart.entity.Cart;

public interface CartRepository extends JpaRepository<Cart, Long>{
	
	List<Cart> findByMemberId(String email);   // member에 있는 cart 정보
	
	Cart findByMemberIdAndItemId (String email, long itemId);
}
