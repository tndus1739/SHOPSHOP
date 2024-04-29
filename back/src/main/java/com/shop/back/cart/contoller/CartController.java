package com.shop.back.cart.contoller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shop.back.item.repository.ItemRepository;
import com.shop.back.item.service.File_itemService;
import com.shop.back.item.service.ItemService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

}
